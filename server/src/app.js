const express = require('express');
const cors = require('cors');
const healthRouter = require('./health/health');
const errorHandler = require('./api/middleware/errorHandler');
const routeGuard = require('./api/middleware/routeGuard');

const { apiRouter, authRouter } = require('./api/routes');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
  }),
);
app.use(express.json());
app.use(healthRouter);
app.use('/auth', authRouter);
app.use('/api', routeGuard, apiRouter);
app.use(errorHandler);

module.exports = app;
