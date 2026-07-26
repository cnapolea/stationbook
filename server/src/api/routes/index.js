const workstationRouter = require('./workstations');
const authRouter = require('./auth');
const apiRouter = require('express').Router();

apiRouter.use(workstationRouter);

module.exports = {
  authRouter,
  apiRouter,
};
