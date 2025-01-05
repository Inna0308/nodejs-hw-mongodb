import { Contact } from '../db/models/contacts.js';

export const getContacts = () => Contact.find();

export const getContactById = (contactId) => Contact.findById(contactId);

export const addContact = (data) => Contact.create(data);

export const updateContact = async (_id, data) => {
  const result = await Contact.findOneAndUpdate({ _id }, data, { new: true });

  return result;
};

export const deleteContact = (filter) => Contact.findOneAndDelete(filter);
