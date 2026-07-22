const z = require('zod');
const bcrypt = require('bcrypt');

const { prisma } = require('../lib/prisma');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../lib/errors');

const { JWT_SECRET } = require('../lib/constants');

const RegisterBody = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  password: z.string(),
});

const LoginBody = z.object({
  email: z.email(),
  password: z.string(),
});

async function register(reqData) {
  // 1. Validate the structure of the incoming request with zod.
  const data = await RegisterBody.parseAsync(reqData);

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

  //4. Let's create the jwt
  const payload = {
    id: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });

  //5. Returning response to router
  return { user: payload, token };
}

async function login(reqData) {
  // Validate incoming data structure and field values type.
  const data = await LoginBody.parseAsync(reqData);

  //Try to get user from database.
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Timing attack mechanism.
  if (!user) {
    const DUMMY_HASH =
      'i09cnSAYHv6okd6AnracFhdyc2khb43oc0NMGZGTu7ZG4kgJ0fMYmXRzo99aQVslDUdr7sitwgjM5tydsnFCPQ==';
    await bcrypt.compare(password, DUMMY_HASH);
    throw new AuthenticationError('Invalid email or password.');
  }

  // Hash comparison.
  const passwordCheck = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCheck)
    throw new AuthenticationError('Invalid email or password.');

  // Generate signed jwt.
  const payload = {
    id: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    user: payload,
    token,
  };
}

module.exports = {
  register,
  login,
};
