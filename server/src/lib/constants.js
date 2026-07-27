require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  DB_CONNECTION_STRING: process.env.DATABASE_URL,
  SLOT_START_TIMES: [0, 3, 6, 9, 12, 15, 18, 21],
  BOOKING_STATUS: {
    BOOKED: 'BOOKED',
    CANCELLED: 'CANCELLED',
  },
  SLOT_LENGTH_HOUR: 3,
};
