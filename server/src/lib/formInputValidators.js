function validateStringInput(value) {
  const valueLength = value.length !== 0;
  const valueIsNotEmpty = value !== ' ';
  return valueLength && valueIsNotEmpty;
}

function validateDate(date) {
  const currentDate = new Date();
  const bookingDate = new Date(date);
  return (
    new Date(currentDate.toISOString().split('T')[0]) <=
    new Date(bookingDate.toISOString().split('T')[0])
  );
}

// function validateDateInFuture(date) {
//   const currentDate = new Date();
//   const bookingDate = new Date(date);
//   return (
//     new Date(currentDate.toISOString().split('T')[0]) <=
//     new Date(bookingDate.toISOString().split('T')[0])
//   );
// }

// function timeSlotExists(date) {
//   // Checking if time inputted is actually present in our timeslots
//   const bookingStartTime = new Date(date);
//   const bookingHour = bookingStartTime.getUTCHours();
//   const timeSlots = new Set(SLOT_START_TIMES);
//   const isTimeSlot = timeSlots.has(bookingHour);

//   // Checking if time slot input is correct (no additional minutes, seconds or milliseconds)

//   const correctSlotTime = new Date(bookingStartTime).setUTCHours(
//     bookingHour,
//     0,
//     0,
//     0,
//   );

//   const isTimeCorrect = bookingStartTime.getTime() !== correctSlotTime;

//   return isTimeSlot && isTimeCorrect;
// }

// function checkTimeInPast(date) {
//   const currentTime = Date.now();
//   return currentTime > date.getTime();
// }

module.exports = {
  validateStringInput,
  validateDate,
};
