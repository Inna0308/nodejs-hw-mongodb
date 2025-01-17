import { Contact } from '../db/models/contacts.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;

  const contactsQuery = Contact.find();
  if (filter.contactType) {
    contactsQuery.where('contactType', filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite', filter.isFavourite);
  }

  if (filter.userId) {
    contactsQuery.where('userId', filter.userId);
  }

  const items = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });
  const totalItems = await Contact.find(
    contactsQuery.getQuery(),
  ).countDocuments();

  const paginationData = calcPaginationData({ totalItems, page, perPage });

  return {
    data: items,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const addContact = (data) => Contact.create(data);

export const updateContact = async (_id, userId, data) => {
  const result = await Contact.findOneAndUpdate({ _id, userId }, data, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};
