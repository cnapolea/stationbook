class InvalidCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidCredentialsError';
    Error.captureStackTrace(this);
  }
}

module.exports = {
  InvalidCredentialsError,
};
