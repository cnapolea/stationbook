import { expect, test, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';
import z from 'zod';

test.describe('POST /auth/register', () => {
  const data = {
    email: 'test@user.com',
    password: 'c8d1K/z2Xz1/',
    firstName: 'Test',
    lastName: 'User',
  };

  const dataIncorrectPassword = {
    email: 'test@user.com',
    password: '12345',
    firstName: 'Test',
    lastName: 'User',
  };

  const dataIncorrectEmail = {
    email: 'test@usercom',
    password: 'c8d1K/z2Xz1/',
    firstName: 'Test',
    lastName: 'User',
  };
  const dataEmptyName = {
    email: 'test@user.com',
    password: 'c8d1K/z2Xz1/',
    firstName: '',
    lastName: '',
  };

  test('Returns 201 status code on successful registration', async () => {
    const response = await request(app).post('/auth/register').send(data);
    expect(response.statusCode).toBe(201);
  });

  test('Returns the id, role and token of registered user on successful registration', async () => {
    const response = await request(app).post('/auth/register').send(data);
    expect(response.body).toEqual({
      user: {
        id: expect.schemaMatching(z.uuidv4()),
        role: expect.schemaMatching(z.literal('STUDENT')),
      },
      token: expect.schemaMatching(z.jwt()),
    });
  });

  test('Returns 400 status code if request body is empty', async () => {
    const responseEmptyBody = await request(app)
      .post('/auth/register')
      .send({});
    expect(responseEmptyBody.statusCode).toEqual(400);
  });

  test('Returns 400 status code if request body properties firstName and lastName are empty', async () => {
    const responseEmptyName = await request(app)
      .post('/auth/register')
      .send(dataEmptyName);
    expect(responseEmptyName.statusCode).toEqual(400);
  });

  test('Returns 400 status code if request body property email is malformed', async () => {
    const responseIncorrectEmail = await request(app)
      .post('/auth/register')
      .send(dataIncorrectEmail);
    expect(responseIncorrectEmail.statusCode).toEqual(400);
  });

  test('Returns 400 status code if request body property password is malformed', async () => {
    const responseIncorrectPassword = await request(app)
      .post('/auth/register')
      .send(dataIncorrectPassword);
    expect(responseIncorrectPassword.statusCode).toEqual(400);
  });

  test('Returns 409 status code if email exists', async () => {
    await request(app).post('/auth/register').send(data);

    const response = await request(app).post('/auth/register').send(data);
    expect(response.statusCode).toEqual(409);
  });
});

afterEach(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => await prisma.$disconnect());
