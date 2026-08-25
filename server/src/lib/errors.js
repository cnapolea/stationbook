const { JsonWebTokenError } = require('jsonwebtoken');

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    Error.captureStackTrace(this);
  }
}

class ClientBadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClientBadRequestError';
    Error.captureStackTrace(this);
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    Error.captureStackTrace(this);
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    Error.captureStackTrace(this);
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    Error.captureStackTrace(this);
  }
}

class TokenError extends JsonWebTokenError {
  constructor(message) {
    super(message);
    this.name = 'TokenError';
    Error.captureStackTrace(this);
  }
}

class ServerConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServerConfigError';
    Error.captureStackTrace(this);
  }
}

module.exports = {
  AuthenticationError,
  ClientBadRequestError,
  ConflictError,
  NotFoundError,
  TokenError,
  ServerConfigError,
  AuthorizationError,
};
