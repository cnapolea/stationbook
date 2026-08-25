import { test, expect, beforeEach, afterEach, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';

test.describe('Workstation Endpoint', () => {
  beforeEach(async (ctx) => {
    const response = await request(app).post('/auth/register').send({
      firstName: 'Obi-Wan',
      lastName: 'Kenobi',
      email: 'obi1@jedi.com',
      password: 'c8d1K/z2Xz1/',
    });

    ctx.token = `Bearer ${response.body.token}`;
  });

  test.describe('Test GET /api/workstations', () => {
    test('Returns 200 status code for: successful request', async ({
      token,
    }) => {
      const response = await request(app)
        .get('/api/workstations')
        .set('authorization', token);

      expect(response.statusCode).toEqual(200);
    });
  });

  test.describe('Test GET /api/workstations/:workstationId/slots', () => {
    test('Returns 400 status code for: date in the past', async ({ token }) => {
      const currentDate = new Date();
      const pastDate = new Date(
        new Date(currentDate).setUTCDate(currentDate.getUTCDate() - 1),
      );

      const response = await request(app)
        .get('/api/workstations/1/slots')
        .query({ date: pastDate })
        .set('authorization', token);
      expect(response.statusCode).toEqual(400);
    });

    test('Returns 404 status code for: workstation does not exist', async ({
      token,
    }) => {
      const currentDate = new Date().toISOString().slice(0, 10);
      const response = await request(app)
        .get('/api/workstations/1000/slots')
        .query({ date: currentDate })
        .set('authorization', token);
      expect(response.statusCode).toEqual(404);
    });

    test('Returns 404 status code for: workstation is not active', async ({
      token,
    }) => {
      await prisma.workstation.update({
        where: {
          id: 2,
        },
        data: {
          isActive: false,
        },
      });
      const currentDate = new Date().toISOString().slice(0, 10);

      const response = await request(app)
        .get('/api/workstations/2/slots')
        .query({ date: currentDate })
        .set('authorization', token);
      expect(response.statusCode).toEqual(404);
    });

    test('Returns 200 status code for: successful request.', async ({
      token,
    }) => {
      const currentDate = new Date().toISOString().slice(0, 10);

      const response = await request(app)
        .get('/api/workstations/1/slots')
        .query({ date: currentDate })
        .set('authorization', token);
      expect(response.statusCode).toEqual(200);
    });

    test('Returns 8 time slots on: successful request.', async ({ token }) => {
      const currentDate = new Date();
      const nextDay = new Date(
        new Date(currentDate).setUTCDate(currentDate.getUTCDate() + 1),
      )
        .toISOString()
        .slice(0, 10);
      const response = await request(app)
        .get('/api/workstations/1/slots')
        .query({ date: nextDay })
        .set('authorization', token);
      expect(response.body.availableSlots.length).toEqual(8);
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.workstation.update({
      where: {
        id: 2,
      },
      data: {
        isActive: true,
      },
    });
    await prisma.$disconnect();
  });
});
