import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import { getEnvVar } from './utils/getEnvVar.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static('upload'));
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/api-docs', swaggerDocs());
  app.use('/auth', authRouter);
  app.use('/', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(getEnvVar('PORT', 3000));

  app.listen(port, () => console.log(`Server running on ${port} port`));
};
