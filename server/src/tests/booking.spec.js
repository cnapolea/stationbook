import { test, expect, beforeEach, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';
import z from 'zod';
import { validateDate } from '../lib/formInputValidators';

test.describe('Booking Endpoint', () => {
  beforeEach(async (ctx) => {
    const userA = await request(app).post('/auth/register').send({
      firstName: 'Obi-Wan',
      lastName: 'Kenobi',
      email: 'obi1@jedi.com',
      password: 'c8d1K/z2Xz1/',
    });

    const userB = await request(app).post('/auth/register').send({
      firstName: 'Anakin',
      lastName: 'Skywalker',
      email: 'anakin@sith.com',
      password: 'c8d1K/z2Xz1/',
    });

    ctx.userA = userA.body;
    ctx.userB = userB.body;
  });

  const getBookingDate = (bookingStartHour = 0, daysToAdd = 1) => {
    const currentDate = new Date();
    const validDate = new Date();
    validDate.setUTCDate(currentDate.getUTCDate() + daysToAdd);
    validDate.setUTCHours(bookingStartHour, 0, 0, 0);
    return validDate;
  };

  const workstationId = 1;

  test.describe('Test POST /api/bookings', () => {
    test('Returns 201 status code on succesful booking', async ({ userB }) => {
      const token = `Bearer ${userB.token}`;
      const response = await request(app)
        .post('/api/bookings')
        .send({
          workstationId,
          startTime: getBookingDate(),
        })
        .set('Content-Type', 'application/json')
        .set('authorization', token);

      expect(response.statusCode).toEqual(201);
    });

    test("Successful booking returns the booking's id, workstation id, startTime, endTime, status ", async ({
      userB,
    }) => {
      const token = `Bearer ${userB.token}`;
      const response = await request(app)
        .post('/api/bookings')
        .send({
          workstationId,
          startTime: getBookingDate(),
        })
        .set('Content-Type', 'application/json')
        .set('authorization', token);

      expect(response.body).toEqual({
        booking: {
          id: expect.schemaMatching(z.uuidv4().nonempty()),
          workstationId: expect.schemaMatching(
            z.int().nonnegative().nonoptional(),
          ),
          startTime: expect.schemaMatching(
            z.iso.datetime().refine((val) => validateDate(val)),
          ),
          endTime: expect.schemaMatching(z.iso.datetime()),
          status: expect.schemaMatching(z.literal('BOOKED')),
        },
      });
    });

    test('Return 409 if user has active booking', async ({ userB }) => {
      const token = `Bearer ${userB.token}`;

      await request(app)
        .post('/api/bookings')
        .send({
          workstationId,
          startTime: getBookingDate(3),
        })
        .set('Content-Type', 'application/json')
        .set('authorization', token);

      const response = await request(app)
        .post('/api/bookings')
        .send({
          workstationId,
          startTime: getBookingDate(12, 4),
        })
        .set('Content-Type', 'application/json')
        .set('authorization', token);

      expect(response.statusCode).toEqual(409);
    });

    test('Return 409 if user tries to book a a booked station in same timeslot', async ({
      userA,
      userB,
    }) => {
      const tokenB = `Bearer ${userB.token}`;
      const tokenA = `Bearer ${userA.token}`;

      await request(app)
        .post('/api/bookings')
        .send({
          workstationId,
          startTime: getBookingDate(3),
        })
        .set('Content-Type', 'application/json')
        .set('authorization', tokenA);

      const response = await request(app)
        .post('/api/bookings')
        .send({
          workstationId,
          startTime: getBookingDate(3),
        })
        .set('Content-Type', 'application/json')
        .set('authorization', tokenB);

      expect(response.statusCode).toEqual(409);
    });

    test.for([
      [
        'non-existent workstation',
        { workstationId: 99999, startTime: getBookingDate() },
        400,
      ],
      [
        'inactive workstation',
        { workstationId: 2, startTime: getBookingDate() },
        400,
      ],
      ['empty request body', {}, 400],
      ['missing workstationId', { startTime: getBookingDate() }, 400],
      ['missing startTime', { workstationId: 1 }, 400],
      [
        'non-existent timeslot',
        { workstationId: 1, startTime: getBookingDate(1) },
        400,
      ],
      [
        'timeslot in the past',
        { workstationId: 1, startTime: getBookingDate(0, 0) },
        400,
      ],
      [
        'date in the past',
        { workstationId: 1, startTime: getBookingDate(12, -1) },
        400,
      ],
      [
        'Incorrect timeslot format',
        {
          workstationId: 1,
          startTime: new Date(getBookingDate(12, 30).setUTCMinutes(30)),
        },
        400,
      ],
    ])(
      'Returns 400 status code for: $0',
      async ([testDescription, requestBody, expectedStatusCode], { userB }) => {
        await prisma.workstation.update({
          where: { id: 2 },
          data: {
            isActive: false,
          },
        });
        const token = `Bearer ${userB.token}`;
        const response = await request(app)
          .post('/api/bookings')
          .send(requestBody)
          .set('Content-Type', 'application/json')
          .set('authorization', token);
        expect(response.statusCode).toEqual(expectedStatusCode);
      },
    );

    test('Inactive and non-existent workstation must produce 400 status code and same response.body', async ({
      userB,
    }) => {
      const token = `Bearer ${userB.token}`;
      const responseOne = await request(app)
        .post('/api/bookings')
        .send({ workstationId: 99999, startTime: getBookingDate() })
        .set('Content-Type', 'application/json')
        .set('authorization', token);
      const responseTwo = await request(app)
        .post('/api/bookings')
        .send({ workstationId: 2, startTime: getBookingDate() })
        .set('Content-Type', 'application/json')
        .set('authorization', token);

      expect(responseOne.statusCode).toEqual(responseTwo.statusCode);
      expect(responseOne.body).toEqual(responseTwo.body);
      expect(responseOne.statusCode).toEqual(400);
    });
  });

  test.describe('Test POST /api/bookings/me', () => {
    test('Returns 200 status code for: successful request', async ({
      userA,
    }) => {
      const token = `Bearer ${userA.token}`;
      const response = await request(app)
        .get('/api/bookings/me')
        .set('authorization', token);
      expect(response.statusCode).toEqual(200);
    });

    test('Response body contains key bookings with an array as value', async ({
      userA,
    }) => {
      const token = `Bearer ${userA.token}`;
      const response = await request(app)
        .get('/api/bookings/me')
        .set('authorization', token);
      expect(response.body).toEqual({
        bookings: expect.schemaMatching(z.array()),
      });
    });

    test('Returns an empty array for users with no bookings', async ({
      userA,
    }) => {
      const token = `Bearer ${userA.token}`;
      const response = await request(app)
        .get('/api/bookings/me')
        .set('authorization', token);
      expect(response.body.bookings.length).toEqual(0);
    });
  });

  test('Returns an array with one booking', async ({ userA }) => {
    const token = `Bearer ${userA.token}`;

    await request(app)
      .post('/api/bookings')
      .send({
        workstationId,
        startTime: getBookingDate(12, 10),
      })
      .set('Content-Type', 'application/json')
      .set('authorization', token);

    const response = await request(app)
      .get('/api/bookings/me')
      .set('authorization', token);
    expect(response.body.bookings.length).toEqual(1);
  });

  test('Response body matches expected object', async ({ userA }) => {
    const token = `Bearer ${userA.token}`;

    const bookingDate = getBookingDate(12, 10);
    const bookingEndDate = new Date(bookingDate);

    const expectedResponseBody = [
      {
        id: '',
        startTime: bookingDate.toJSON(),
        endTime: new Date(
          bookingEndDate.setUTCHours(bookingDate.getUTCHours() + 3),
        ).toJSON(),
        workstation: {
          label: 'c1r1s1',
        },
      },
    ];

    const bookingDetails = await request(app)
      .post('/api/bookings')
      .send({
        workstationId,
        startTime: getBookingDate(12, 10),
      })
      .set('Content-Type', 'application/json')
      .set('authorization', token);

    expectedResponseBody[0].id = bookingDetails.body.booking.id;

    const response = await request(app)
      .get('/api/bookings/me')
      .set('authorization', token);
    expect(response.body.bookings).toMatchObject(expectedResponseBody);
  });

  afterEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.workstation.update({
      where: { id: 2 },
      data: {
        isActive: true,
      },
    });
    await prisma.$disconnect();
  });
});
