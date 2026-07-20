const express = require('express');
const cors = require('cors');
const healthRouter = require('./health/health');
const authRouter = require('./api/routes/auth');
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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = {
  app,
};
