const authRouter = require('./auth');
const workstationRouter = require('./workstations');
const bookingRouter = require('./bookings');
const apiRouter = require('express').Router();

apiRouter.use(workstationRouter);
apiRouter.use(bookingRouter);

module.exports = {
  authRouter,
  apiRouter,
};
