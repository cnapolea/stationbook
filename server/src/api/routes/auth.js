const { Router } = require('express');
const { register } = require('./../../services/auth');
const router = Router();

router.post('/register', async (req, res) => {
  const body = req.body;
  const data = await register(body);
  res.status(201).json(data);
});

module.exports = router;
