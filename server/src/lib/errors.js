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

class ResourceAlreadyExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ResourceAlreadyExistsError';
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

class UnavailableResourceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnavailableResourceError';
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
  ResourceAlreadyExistsError,
  NotFoundError,
  UnavailableResourceError,
  TokenError,
  ServerConfigError,
};
