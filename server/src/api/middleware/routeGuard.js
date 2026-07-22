const jwt = require('jsonwebtoken');

const { AuthenticationError } = require('../../lib/errors');
const { JWT_SECRET } = require('../../lib/constants');

async function routeGuard(req, res, next) {
  // Extracting authorization header value
  const authHeader = req.headers?.authorization;
  // Verifying if auth header value exists
  if (!authHeader)
    throw new AuthenticationError('Authentication token missing from request.');

  const [scheme, token] = authHeader.split(' ');
  // Verifying if Auth Header match our adopted auth scheme "Bearer" and if there is a Token associated with the scheme.
  if (scheme !== 'Bearer' || !token) {
    throw new AuthenticationError('Token wrongly formatted.');
  }

  // Verify if jwt signature is valid
  const payload = jwt.verify(token, JWT_SECRET);

  //Pass the user id and role to the req.user prop
  req.user = { id: payload.id, role: payload.role };

  next();
}

module.exports = routeGuard;
