require('dotenv').config();
const zod = require('zod');
const bcrypt = require('bcrypt');

const { prisma } = require('../lib/prisma');
const jwt = require('jsonwebtoken');

const User = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.email(),
  password: zod.string(),
});

async function register(reqData) {
  // 1. Validate the structure of the incoming request with zod.
  const data = await User.parseAsync(reqData);

  // 2. Hashing of the user's inputted password
  const password = data.password;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // 3. Storing the user in the db
  const record = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash,
  };

  const user = await prisma.user.create({ data: record });
  await prisma.$disconnect();

  //4. Let's create the jwt
  const jwtSecret = `${process.env.JWT_SECRET}`;
  const payload = {
    id: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: '7d',
  });

  //5. Returning response to router
  return { user: payload, token };
}

module.exports = {
  register,
};
