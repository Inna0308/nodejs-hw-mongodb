import { Router } from 'express';

import * as contactsController from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get(
  '/contacts',
  ctrlWrapper(contactsController.getContactsController),
);

contactsRouter.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(contactsController.getContactsByIdController),
);

contactsRouter.post(
  '/contacts',
  validateBody(contactAddSchema),
  ctrlWrapper(contactsController.addContactsController),
);

contactsRouter.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactsController.patchContactsController),
);

contactsRouter.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(contactsController.deleteContactsController),
);

export default contactsRouter;
