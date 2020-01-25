// Allows .env file to specify environment variables.
require('dotenv').config();
// Allows absolute path requires.
require('module-alias/register');

const express = require('express');
const morgan = require('morgan');

const middleware = require('@src/middleware');
const logger = require('@src/service/logger');
const { BadRequestError } = require('@src/shared/error');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('tiny'));
app.use(middleware.arrayBufferParser);
app.use(middleware.errorHandler);

// Disables http cache.
app.disable('etag');

// Capture to unimplemented endpoint.
app.all('*', (req, _res) => {
  throw new BadRequestError(`Request not implemented ${req.toString()}`);
});

app.listen(PORT, () => logger.log('Started at port:', PORT));
