const { Router } = require('express');
const { register } = require('./../../services/auth');
const router = Router();
const { Prisma } = require('../../lib/prisma');

const zod = require('zod');
router.post('/register', async (req, res) => {
  const body = req.body;

  try {
    const data = await register(body);
    res.status(201).json(data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        res.status(409).json({ message: 'email already exists' });
      }
    } else if (e instanceof zod.ZodError) {
      res.status(400).json(e.issues);
    } else {
      res.status(500);
    }
  }
});

module.exports = router;
