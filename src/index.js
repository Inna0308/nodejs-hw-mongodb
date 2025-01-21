import { setupServer } from './server.js';

import { initMongoConnection } from './db/initMongoConnection.js';

import { createDirIfNotExists } from './utils/createDirIfNotExists.js';

import { TEMP_UPLOAD_DIR, UPLOADS_DIR } from './constants/index.js';

const boostrap = async () => {
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOADS_DIR);

  await initMongoConnection();
  setupServer();
};

boostrap();
