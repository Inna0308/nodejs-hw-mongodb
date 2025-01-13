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

  const items = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });
  const totalItems = await Contact.find().merge(contactsQuery).countDocuments();

  const paginationData = calcPaginationData({ totalItems, page, perPage });

  return {
    data: items,
    ...paginationData,
  };
};

export const getContactById = (contactId) => Contact.findById(contactId);

export const addContact = (data) => Contact.create(data);

export const updateContact = async (_id, data) => {
  const result = await Contact.findOneAndUpdate({ _id }, data, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const deleteContact = (filter) => Contact.findOneAndDelete(filter);
