require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  DB_CONNECTION_STRING: process.env.DATABASE_URL,
};
