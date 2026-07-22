class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    Error.captureStackTrace(this);
  }
}

module.exports = {
  AuthenticationError,
};
