// Required to enable module aliasing.
import 'module-alias/register';

import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import connect from 'shared/db';

import { dbConfig } from '@src/config';
import registerRoutes from '@src/api';
import { routes as webhookRoutes } from '@src/api/webhook/defs';
import { arrayBufferParser, errorHandler } from '@src/middleware';
import logger from '@src/service/logger';

// To initialize connection with plaid service.
import '@src/service/plaid';

// Allows .env file to specify environment variables.
config();

// To initialize connection to db.
connect(dbConfig);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('tiny'));
// Must come first to handle all errors.
app.use(errorHandler);
// handles application/octet-stream type for protobuf
app.use(arrayBufferParser(/* routesToExclude= */ [...webhookRoutes]));
// Disables http cache.
app.disable('etag');

// Register routes.
registerRoutes(app);

app.listen(PORT, () => logger.log('Started at port:', PORT));
