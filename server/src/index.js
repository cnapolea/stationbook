const express = require('express');
const cors = require('cors');
const healthRouter = require('./health/health');
const errorHandler = require('./api/middleware/errorHandler');
const routeGuard = require('./api/middleware/routeGuard');

const { apiRouter, authRouter } = require('./api/routes');
const {
  DB_CONNECTION_STRING,
  JWT_SECRET,
  ERROR_MESSAGE,
} = require('./lib/constants');
const { ServerConfigError } = require('./lib/errors');

const app = express();
const PORT = 4000;

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

app.listen(PORT, () => {
  if (!JWT_SECRET || !DB_CONNECTION_STRING) {
    throw new ServerConfigError(ERROR_MESSAGE.ENV_VARIABLES_NOT_LOADED);
  }
  console.log(`Server listening on port ${PORT}`);
});

module.exports = {
  app,
};
