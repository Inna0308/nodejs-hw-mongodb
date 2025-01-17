import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { User } from '../db/models/User.js';
import { Session } from '../db/models/Session.js';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

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

export const getUser = async (filter) => {
  return User.findOne(filter);
};

export const getSession = async (filter) => {
  return Session.findOne(filter);
};
