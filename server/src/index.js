// Allows .env file to specify environment variables.
require('dotenv').config();
// Allows absolute path requires.
require('module-alias/register');

require('@src/service/plaid');

const express = require('express');
const morgan = require('morgan');

const registerRoutes = require('@src/api');
const webhookRoutes = require('@src/api/webhook/defs').routes;
const middleware = require('@src/middleware');
const logger = require('@src/service/logger');
const { BadRequestError } = require('@src/shared/error');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('tiny'));
// Must come first to handle all errors.
app.use(middleware.errorHandler);
app.use(
  middleware.arrayBufferParser(/* routesToExclude= */ [...webhookRoutes]),
);

// Disables http cache.
app.disable('etag');

// Capture to unimplemented endpoint.
app.all('*', (req, _res) => {
  throw new BadRequestError(`Request not implemented ${req.toString()}`);
});

registerRoutes(app);
app.listen(PORT, () => logger.log('Started at port:', PORT));
