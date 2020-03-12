import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import proto from 'shared/proto';
import connect from 'shared/db';

import { secretKey } from '@src/config';
import logger from '@src/service/logger';
import {
  BaseCustomError,
  BadRequestError,
  InvalidLoginError,
  ValidationError,
  DatabaseError,
  PlaidError,
} from '@src/shared/error';
import { CustomRequest } from '@src/types/request';

const { SessionToken } = proto.server;
const { ErrorType, ErrorTypeEnum } = proto.shared;

/**
 * Middleware to convert incoming stream of protobuf request into array buffer.
 *
 * @param routesToExclude - Skip array buffer parser middleware on these routes.
 * @returns Middleware function.
 */
export function arrayBufferParser(routesToExclude: string[]) {
  return (req: CustomRequest, _res: Response, next: NextFunction) => {
    if (routesToExclude.includes(req.path)) {
      next();
      return;
    }

    if (!req.is('application/octet-stream')) {
      throw new BadRequestError(
        `Request did not contain protobuf ${req.toString}`,
      );
    }

    const data: Buffer[] = [];
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
  };
}

/**
 * Middleware to handle all errors occurring in API server.
 *
 * @param err - Custom error class or vanilla Error.
 * @param req - Given
 * @param res - Given
 * @param next - Given
 */
export function errorHandler(
  err: BaseCustomError,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
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
    case DatabaseError:
      errCode = 500;
      break;
    case PlaidError:
      errCode = 500;
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
 */
export async function verifyAuth(
  req: CustomRequest,
  _res: Response,
  next: NextFunction,
) {
  const token = req.get('Capita-Auth');

  if (!token) {
    throw new InvalidLoginError('Missing session token');
  }

  // @ts-ignore: Verified by SessionToken.
  const decoded: { userId?: number } = jwt.verify(token, secretKey);
  const err = SessionToken.verify(decoded);
  if (err) {
    throw new InvalidLoginError('Invalid session token');
  }

  const { User } = await connect();
  const count = await User.count({ where: { id: decoded.userId } });
  if (count === 0) {
    throw new InvalidLoginError('Invalid user');
  }

  req.session = SessionToken.create(decoded);
  next();
}
