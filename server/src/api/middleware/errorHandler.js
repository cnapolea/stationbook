const {
  AuthenticationError,
  ClientBadRequestError,
  ConflictError,
  NotFoundError,
  AuthorizationError,
} = require('../../lib/errors');

const z = require('zod');
const { ERROR_MESSAGE } = require('../../lib/constants');
const { JsonWebTokenError } = require('jsonwebtoken');

function errorHandler(error, req, res, next) {
  console.error(error);

  if (error instanceof z.ZodError) {
    const errorList = error.issues.map((e) => {
      return {
        fieldName: e.path[0],
        message: e.message,
      };
    });

    res.status(400).json({ errorList });
  } else if (error instanceof NotFoundError) {
    res.status(404).json({
      message: error.message,
    });
  } else if (error instanceof AuthenticationError) {
    res.status(401).json({ message: error.message });
  } else if (
    error instanceof ClientBadRequestError ||
    (error instanceof SyntaxError && error.type === 'entity.parse.failed')
  ) {
    res.status(400).json({
      message: error.message,
    });
  } else if (error instanceof JsonWebTokenError) {
    res.status(401).json({ message: ERROR_MESSAGE.INVALID_INPUT('token') });
  } else if (error instanceof ConflictError) {
    res.status(409).json({ message: error.message });
  } else if (error instanceof AuthorizationError) {
    res.status(403).json({ message: error.message });
  } else {
    res.status(500).json({
      message: 'Internal server error.',
    });
  }
}

module.exports = errorHandler;
