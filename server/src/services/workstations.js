const { prisma } = require('../lib/prisma');
const z = require('zod');
const {
  SLOT_START_TIMES,
  BOOKING_STATUS,
  SLOT_LENGTH_HOUR,
  ERROR_MESSAGE,
} = require('../lib/constants');

const { NotFoundError } = require('../lib/errors');

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
    date: z.iso.date().refine(
      (val) => {
        const today = new Date();
        const queryDate = new Date(val);
        return (
          new Date(today.toLocaleDateString()) <=
          new Date(queryDate.toLocaleDateString())
        );
      },
      {
        error: ERROR_MESSAGE.INVALID_INPUT('Date: Date in the past'),
      },
    ),
  });

  const data = await WorkstationTimeSlotsBody.parseAsync(reqData);

  const bookingDate = new Date(data.date);

  // We here check if the workstation exists.
  const workstation = await prisma.workstation.findUnique({
    where: {
      id: data.workstationId,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!workstation) {
    throw new NotFoundError(
      ERROR_MESSAGE.RESOURCE_DOES_NOT_EXIST('Workstation'),
    );
  } else if (!workstation.isActive) {
    throw new NotFoundError(
      ERROR_MESSAGE.RESOURCE_DOES_NOT_EXIST('Workstation'),
    );
  }

  // Retrieve the booking times from the db.
  const nextDayOfBooking = new Date(
    new Date(bookingDate).setUTCDate(bookingDate.getUTCDate() + 1),
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

  const availableTimeSlots = SLOT_START_TIMES.filter((item) => {
    const isNotBooked = !slotStartTimesUnavailable.has(item);
    const bookingTimeSlot = new Date(new Date(bookingDate)).setUTCHours(
      item,
      0,
      0,
      0,
    );
    const isTimeSlotInFuture = bookingTimeSlot > new Date().getTime();
    return isNotBooked && isTimeSlotInFuture;
  }).map((hour) => ({
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
