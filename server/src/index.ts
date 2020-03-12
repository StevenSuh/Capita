// Required to enable module aliasing.
import 'module-alias/register';

import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import connect from 'shared/db';

import registerRoutes from '@src/api';
import { routes as webhookRoutes } from '@src/api/webhook/defs';
import { arrayBufferParser, errorHandler } from '@src/middleware';
import logger from '@src/service/logger';
import { BadRequestError } from '@src/shared/error';

import '@src/service/plaid';

// Allows .env file to specify environment variables.
config();

// Makes a connection to db.
connect();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('tiny'));
// Must come first to handle all errors.
app.use(errorHandler);
app.use(arrayBufferParser(/* routesToExclude= */ [...webhookRoutes]));

// Disables http cache.
app.disable('etag');

// Capture to unimplemented endpoint.
app.all('*', (req, _res) => {
  throw new BadRequestError(`Request not implemented ${req.toString()}`);
});

// registerRoutes(app);
app.listen(PORT, () => logger.log('Started at port:', PORT));
