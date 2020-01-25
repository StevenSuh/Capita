const jwt = require('jsonwebtoken');
const { SessionToken } = require('shared/proto/server/session_token').server;
const {
  ErrorType,
  ErrorTypeEnum,
} = require('shared/proto/shared/error_type').shared;

const { secretKey } = require('@src/config');
const { User } = require('@src/db/models');
const logger = require('@src/service/logger');
const {
  BadRequestError,
  InvalidLoginError,
  ValidationError,
} = require('@src/shared/error');

/**
 * Middleware to convert incoming stream of protobuf request into array buffer.
 *
 * @param {object} req - Given
 * @param {object} res - Given
 * @param {object} next - Given
 */
function arrayBufferParser(req, res, next) {
  if (!req.is('application/octet-stream')) {
    throw new BadRequestError(
      `Request did not contain protobuf ${req.toString}`,
    );
  }

  const data = [];
  req.on('data', chunk => data.push(chunk));
  req.on('end', () => {
    if (data.length <= 0) {
      throw new BadRequestError(
        `Request did not contain protobuf ${req.toString}`,
      );
    }
    req.raw = Buffer.concat(data);
    next();
  });
}

/**
 * Middleware to handle all errors occurring in API server.
 *
 * @param {?|Error} err - Custom error class or vanilla Error.
 * @param {object} req - Given
 * @param {object} res - Given
 * @param {object} next - Given
 */
function errorHandler(err, req, res, next) {
  logger.error(err.message);

  let errCode;
  let { typeBuffer } = err;
  switch (err.constructor) {
    case BadRequestError:
      errCode = 400;
      break;
    case InvalidLoginError:
      errCode = 400;
      break;
    case ValidationError:
      errCode = 400;
      break;
    default:
      errCode = 500; // server error by default
      typeBuffer = ErrorType.encode(
        ErrorType.create({ type: ErrorTypeEnum.UNKNOWN }),
      ).finish();
      break;
  }

  res.status(errCode).send(typeBuffer);
  next();
}

/**
 * Middleware to verify the userId of token in request header.
 *
 * @param {object} req - Given
 * @param {object} res - Given
 * @param {object} next - Given
 */
async function verifyAuth(req, res, next) {
  const token = req.get('Capita-Auth');

  if (!token) {
    throw new InvalidLoginError('Missing session token');
  }

  const decoded = jwt.verify(token, secretKey);
  const err = SessionToken.verify(decoded);
  if (err) {
    throw new InvalidLoginError('Invalid session token');
  }

  const count = await User.count({ where: { id: token.userId } });
  if (count === 0) {
    throw new InvalidLoginError('Invalid user');
  }

  req.session = decoded;
  next();
}

module.exports = {
  arrayBufferParser,
  errorHandler,
  verifyAuth,
};
