const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '..', '..', '.env'),
});

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  DB_CONNECTION_STRING: process.env.DATABASE_URL,
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
    ENV_VARIABLES_NOT_LOADED: 'Critical environment variables not loaded.',
  },
  DUMMY_HASH: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7hw93fDX6mC/N.0vjX3/uOW',
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/,
};
