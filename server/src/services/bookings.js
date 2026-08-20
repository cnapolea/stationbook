const z = require('zod');
const { prisma } = require('../lib/prisma');
const { PrismaClientKnownRequestError } = require('@prisma/client');
const { validateDate } = require('../lib/formInputValidators');
const {
  ERROR_MESSAGE,
  SLOT_LENGTH_HOUR,
  SLOT_START_TIMES,
  BOOKING_STATUS,
} = require('../lib/constants');
const {
  ResourceAlreadyExistsError,
  ClientBadRequestError,
} = require('../lib/errors');

async function createBooking(reqData) {
  try {
    // Creating Zod Validation Object
    const CreateBookingBody = z.object({
      workstationId: z.int(),
      startTime: z.iso.datetime().refine((val) => validateDate(val), {
        error: ERROR_MESSAGE.INVALID_INPUT('Date'),
      }),
    });

    const userId = reqData.userId;
    const data = await CreateBookingBody.parseAsync(reqData);

    // Time check logic: Check if time selected is really one of the available time slots
    const bookingStartTime = new Date(data.startTime);
    const timeSlots = new Set(SLOT_START_TIMES);

    if (!timeSlots.has(bookingStartTime.getUTCHours())) {
      throw new ClientBadRequestError(
        ERROR_MESSAGE.RESOURCE_DOES_NOT_EXIST('timeslot'),
      );
    }

    // Time check logic: Check if correct time slot is picked. Here, we are trying to avoid user to schedule non available time slots such as 09:10:55.123
    const correctFormatSlotTime = new Date(bookingStartTime).setUTCHours(
      bookingStartTime.getUTCHours(),
      0,
      0,
      0,
    );

    if (bookingStartTime.getTime() !== correctFormatSlotTime) {
      throw new ClientBadRequestError(ERROR_MESSAGE.INVALID_INPUT('Time Slot'));
    }

    // Checking if the workstation exists and is active.
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
      throw new ClientBadRequestError(
        ERROR_MESSAGE.RESOURCE_DOES_NOT_EXIST('Workstation'),
      );
    } else if (!workstation.isActive) {
      throw new ClientBadRequestError(
        ERROR_MESSAGE.RESOURCE_DOES_NOT_EXIST('Workstation'),
      );
    }

    const userHasBooking = await prisma.booking.findFirst({
      where: {
        userId,
        status: BOOKING_STATUS.BOOKED,
        endTime: {
          gt: new Date(),
        },
      },
    });

    if (userHasBooking)
      throw new ResourceAlreadyExistsError(
        ERROR_MESSAGE.RESOURCE_ALREADY_EXISTS('Active booking'),
      );

    // Computing endTime of booking
    const bookingEndTime = new Date(
      new Date(bookingStartTime).setUTCHours(
        bookingStartTime.getUTCHours() + SLOT_LENGTH_HOUR,
      ),
    );

    // Storing new booking into DB
    const newBooking = await prisma.booking.create({
      data: {
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        workstationId: data.workstationId,
        userId,
      },
    });

    return {
      booking: {
        id: newBooking.id,
        workstationId: newBooking.workstationId,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        status: newBooking.status,
      },
    };
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ResourceAlreadyExistsError(
        ERROR_MESSAGE.RESOURCE_ALREADY_EXISTS('Booking'),
      );
    } else throw error;
  }
}

async function getStudentBookings(reqData) {
  const userId = reqData.userId;
  const bookings = await prisma.booking.findMany({
    where: {
      userId,
      status: BOOKING_STATUS.BOOKED,
      endTime: { gt: new Date() },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      workstation: {
        select: {
          label: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  return {
    bookings,
  };
}

module.exports = {
  createBooking,
  getStudentBookings,
};
