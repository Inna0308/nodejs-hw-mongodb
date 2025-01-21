import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';

import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';
import { TEMPLATES_DIR } from '../constants/index.js';

const resetPasswordTemplatePath = path.join(
  TEMPLATES_DIR,
  'reset-password-email.html',
);

const templateSource = await readFile(resetPasswordTemplatePath, 'utf-8');

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const register = async (payload) => {
  const { email, password } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError(409, 'Email in use');

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...payload, password: hashPassword });

  return newUser;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Email or password invalid');

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw createError(401, 'Email or password invalid');

  await Session.deleteOne({ userId: user._id });

  const session = createSession();

  return Session.create({
    userId: user._id,
    ...session,
  });
};

export const refreshToken = async ({ refreshToken, sessionId }) => {
  const oldSession = await Session.findOne({ refreshToken, _id: sessionId });
  if (!oldSession) {
    throw createError(401, 'Session not found');
  }
  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: sessionId });

  const session = createSession();

  return Session.create({
    userId: oldSession.userId,
    ...session,
  });
};

export const logout = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const resetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createError(500, 'Failed to send the email, please try again later');
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
    console.log('Entries:', entries);
  } catch (error) {
    if (error instanceof Error)
      throw createError(401, 'Token is expired or invalid');
    throw error;
  }

  const user = await User.findOne({ email: entries.email, _id: entries.sub });

  if (!user) {
    throw createError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
  await Session.deleteOne({ userId: user._id });
};

export const getUser = async (filter) => {
  return User.findOne(filter);
};

export const getSession = async (filter) => {
  return Session.findOne(filter);
};
