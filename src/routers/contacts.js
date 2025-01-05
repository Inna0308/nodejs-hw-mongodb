import { Router } from 'express';

import * as contactsController from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get(
  '/contacts',
  ctrlWrapper(contactsController.getContactsController),
);

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(contactsController.getContactsByIdController),
);

contactsRouter.post(
  '/contacts',
  ctrlWrapper(contactsController.addContactsController),
);

contactsRouter.patch(
  '/contacts/:contactId',
  ctrlWrapper(contactsController.patchContactsController),
);

contactsRouter.delete(
  '/contacts/:contactId',
  ctrlWrapper(contactsController.deleteContactsController),
);

export default contactsRouter;
