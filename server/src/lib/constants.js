const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '..', '..', '.env'),
});

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  DB_CONNECTION_STRING: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  SLOT_START_TIMES: [0, 3, 6, 9, 12, 15, 18, 21],
  BOOKING_STATUS: {
    BOOKED: 'BOOKED',
    CANCELLED: 'CANCELLED',
  },
  SLOT_LENGTH_HOUR: 3,
  ERROR_MESSAGE: {
    INVALID_INPUT: (input) => `Invalid ${input.toLocaleLowerCase()}.`,
    RESOURCE_ALREADY_EXISTS: (resource) => `${resource} already exists.`,
    RESOURCE_DOES_NOT_EXIST: (resource) => `${resource} does not exist.`,
    RESOURCE_UNAVAILABLE: (resource) => `${resource} not available.`,
    RESOURCE_FORBIDDEN: (resource) => `${resource} not accessible.`,
    ENV_VARIABLES_NOT_LOADED: (envVar) =>
      `Critical environment variables not loaded: ${envVar}`,
    UNAUTHORIZED_ACTION: (action, agent, identifier) =>
      `Unauthorized action: ${action} - by ${agent} w/ id => ${identifier}`,
    BOOKING_CHANGE_HOUR_POLICY: 'Booking starting in less than 2 hours',
  },
  DUMMY_HASH: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7hw93fDX6mC/N.0vjX3/uOW',
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/,
  TWO_HOURS_IN_MS: 2 * 60 * 60 * 1000,
};
