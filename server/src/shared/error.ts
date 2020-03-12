import proto from 'shared/proto';

const { ErrorType, ErrorTypeEnum } = proto.shared;

export class BaseCustomError extends Error {
  type: proto.shared.ErrorType;
  typeBuffer: Uint8Array;
}

/** Client errors */
export class BadRequestError extends BaseCustomError {
  constructor(errorMessage: string) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.BAD_REQUEST });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}

export class InvalidLoginError extends BaseCustomError {
  constructor(errorMessage: string) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.INVALID_LOGIN });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}

export class ValidationError extends BaseCustomError {
  constructor(errorMessage: string) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.VALIDATION });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}

/** Server errors */
export class DatabaseError extends BaseCustomError {
  constructor(errorMessage: string) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.DATABASE });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}

export class PlaidError extends BaseCustomError {
  constructor(errorMessage: string) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.PLAID });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}
