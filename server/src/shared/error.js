const { ErrorType, ErrorTypeEnum } = require('shared/proto').shared;

/** Client errors */

class BadRequestError extends Error {
  constructor(errorMessage) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.BAD_REQUEST });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}

class InvalidLoginError extends Error {
  constructor(errorMessage) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.INVALID_LOGIN });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}

class ValidationError extends Error {
  constructor(errorMessage) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.VALIDATION });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}

/** Server errors */
class DatabaseError extends Error {
  constructor(errorMessage) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.DATABASE });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}

class PlaidError extends Error {
  constructor(errorMessage) {
    super(errorMessage);

    this.type = ErrorType.create({ type: ErrorTypeEnum.PLAID });
    this.typeBuffer = ErrorType.encode(this.type).finish();
  }
}

module.exports = {
  BadRequestError,
  InvalidLoginError,
  ValidationError,
  DatabaseError,
  PlaidError,
};
