const { prisma } = require('../lib/prisma');
const z = require('zod');
const {
  SLOT_START_TIMES,
  BOOKING_STATUS,
  SLOT_LENGTH_HOUR,
} = require('../lib/constants');
const { ClientBadRequestError } = require('../lib/errors');

/**
 * fetchWorkstations fetches all workstations requested by the client.
 *
 */
async function fetchWorkstations() {
  const workstations = await prisma.workstation.findMany({
    where: { isActive: true },
  });
  return workstations;
}

/**
 * getWorkstationTimeSlots fetches all available time slots for a given workstation
 * @param {object} reqData
 * @returns {object}
 */

async function getWorkstationTimeSlots(reqData) {
  // Ensure we get the correct information from the incoming request
  const WorkstationTimeSlotsBody = z.object({
    workstationId: z.int(),
    date: z.iso.date(),
  });

  const data = await WorkstationTimeSlotsBody.parseAsync(reqData);

  //Check if date is the past
  const currentDate = new Date();
  const bookingDate = new Date(data.date);

  const dateValidation =
    currentDate.toISOString().split('T')[0] <=
    bookingDate.toISOString().split('T')[0];

  if (!dateValidation)
    throw new ClientBadRequestError('Cannot see time slots in the past.');

  // We here check if the workstation exists.
  await prisma.workstation.findFirstOrThrow({
    where: {
      id: data.workstationId,
    },
  });

  // Retrieve the booking times from the db.
  const nextDayOfBooking = new Date(
    new Date(bookingDate).setDate(bookingDate.getDate() + 1),
  );

  const bookingsStartTimes = await prisma.booking.findMany({
    where: {
      workstationId: data.workstationId,
      startTime: {
        gte: bookingDate,
        lt: nextDayOfBooking,
      },
      status: BOOKING_STATUS.BOOKED,
    },
    select: {
      startTime: true,
    },
  });

  // We return an array with the available dates excluding the ones that have been booked for that day.
  const slotStartTimesUnavailable = new Set(
    bookingsStartTimes.map((booking) => booking.startTime.getUTCHours()),
  );

  const availableTimeSlots = SLOT_START_TIMES.filter(
    (item) => !slotStartTimesUnavailable.has(item),
  ).map((hour) => ({
    startTime: new Date(new Date(bookingDate).setUTCHours(hour, 0, 0, 0)),
    endTime: new Date(
      new Date(bookingDate).setUTCHours(hour + SLOT_LENGTH_HOUR, 0, 0, 0),
    ),
  }));

  return availableTimeSlots;
}

module.exports = {
  fetchWorkstations,
  getWorkstationTimeSlots,
};
