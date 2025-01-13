import { Schema, model } from 'mongoose';

import { typeNumber } from '../../constants/contacts.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      required: true,
    },
    contactType: {
      type: String,
      enum: typeNumber,
      required: true,
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const sortByList = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

contactSchema.post('save', (error, doc, next) => {
  error.status = 400;
  next();
});

export const Contact = model('contact', contactSchema);
