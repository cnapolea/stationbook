import { test, expect, beforeEach, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';

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
 * 3.2 409 if a user tries to book an already booked station
 * 3.3 409 for user B if user A books station first and user B tries to book it right after
 *
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

  test('Returns 201 status code on succesful booking', async ({ userB }) => {
    const currentDate = new Date();
    const validBookingDateTime = new Date();

    validBookingDateTime.setUTCDate(currentDate.getUTCDate() + 1);
    validBookingDateTime.setUTCHours(0, 0, 0, 0);

    const workstationId = 1;
    const token = `Bearer ${userB.token}`;
    const response = await request(app)
      .post('/api/bookings')
      .send({
        workstationId,
        startTime: validBookingDateTime,
      })
      .set('Content-Type', 'application/json')
      .set('authorization', token);

    expect(response.statusCode).toBe(201);
  });

  afterEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
