const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: ['http://localhost:5173'],
  }),
);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
