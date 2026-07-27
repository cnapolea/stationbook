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

module.exports = {
  AuthenticationError,
  ClientBadRequestError,
};
