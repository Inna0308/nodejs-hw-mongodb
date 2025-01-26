import Joi from 'joi';

import { typeNumber } from '../constants/contacts.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'The "Name" field cannot be empty',
    'string.min': 'The "Name" field must have at least {#limit} characters',
    'string.max': 'The "Name" field must have at most {#limit} characters',
    'any.required': 'The "Name" field is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number must be a string',
    'string.empty': 'The "Phone number" field cannot be empty',
    'string.min':
      'The "Phone number" field must have at least {#limit} characters',
    'string.max':
      'The "Phone number" field must have at most {#limit} characters',
    'any.required': 'The "Phone number" field is required',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'Email must be a string',
    'string.empty': 'The "Email" field cannot be empty',
    'string.min': 'The "Email" field must have at least {#limit} characters',
    'string.max': 'The "Email" field must have at most {#limit} characters',
  }),
  isFavourite: Joi.boolean().required(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeNumber)
    .required()
    .messages({
      'string.base': 'Contact type must be a string',
      'string.empty': 'The "Contact type" field cannot be empty',
      'string.min':
        'The "Contact type" field must have at least {#limit} characters',
      'string.max':
        'The "Contact type" field must have at most {#limit} characters',
      'any.only': 'Contact type must be one of the value: work, home, personal',
      'any.required': 'The "Contact type" field is required',
    }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeNumber),
});
