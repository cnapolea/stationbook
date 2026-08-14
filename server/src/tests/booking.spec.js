import { test, expect, beforeEach, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';
import z from 'zod';
import { validateDate } from '../lib/formInputValidators';

/**
 * Integration Test for POST /api/booking endpoint
 */

// 1. Booking requires a valid workstation and a registered user
// 1.1 We must seed workstations before any test
// 1.2 Before each test we must register a user or two.
// 2. After each test we must remove the booking and the user
// 2.1 User first because we did not include on-delete cascade in the relationship between user and booking (Something to consider later on)

/**
 * **Test List**
 * 1. Test successful login
 * 1.1 Must return 201
 * 1.2 Must return correct body format
 *
 * 2. Test malformed requests
 * 2.1. 400 on non-existent workstation
 * 2.2. 400 on inactive workstation
 * 2.3. Inactive and non-existent workstation must produce the same status code, body and one of it must produce the 400
 * 2.4. 400 for empty request.body
 * 2.5  400 for missing property workstationId
 * 2.6  400 for missing property startTime
 * 2.7  400 for booking a non-existent timeslot
 * 2.8  400 for booking a timeslot in the past
 * 2.9  400 for booking with the incorrect timeslot format
 *
 * 3. Test conflicts
 * 3.1 409 if user already has an active booking
 * 3.2 409 if a user tries to book an already booked station at the same timeslot
 */

test.describe('Test POST /api/bookings', () => {
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

  const getBookingDate = (bookingStartHour = 0, daysInTheFuture = 1) => {
    const currentDate = new Date();
    const validDate = new Date();
    validDate.setUTCDate(currentDate.getUTCDate() + daysInTheFuture);
    validDate.setUTCHours(bookingStartHour, 0, 0, 0);
    return validDate;
  };

  const workstationId = 1;

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

  afterEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
