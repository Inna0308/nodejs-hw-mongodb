import createError from 'http-errors';

import * as contactServices from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/filter/parseContactFilterParams.js';
import { saveFileToUpload } from '../utils/saveFileToUpload.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

import { getEnvVar } from '../utils/getEnvVar.js';

import { sortByList } from '../db/models/contacts.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = parseContactFilterParams(req.query);
  filter.userId = req.user._id;

  const contacts = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;

  const contacts = await contactServices.getContactById(contactId, userId);

  if (!contacts) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contacts,
  });
};

export const addContactsController = async (req, res) => {
  const cloudinaryEnable = getEnvVar('CLOUDINARY_ENABLE') === 'true';
  let photo;
  if (req.file) {
    if (cloudinaryEnable) {
      photo = await saveFileToCloudinary(req.file);
    } else {
      photo = await saveFileToUpload(req.file);
    }
  }

  const { _id: userId } = req.user;

  const data = await contactServices.addContact({ ...req.body, photo, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: data,
  });
};

export const patchContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const data = await contactServices.updateContact(contactId, userId, req.body);

  if (!data) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: data,
  });
};

export const deleteContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const data = await contactServices.deleteContact(contactId, userId);

  if (!data) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
