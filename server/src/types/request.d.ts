import { Request } from 'express';
import proto from 'shared/proto';

export interface CustomRequest extends Request {
  raw?: Buffer;
  session?: proto.server.SessionToken;
}
