function validateStringInput(value) {
  const valueIsNotEmpty = value.trim() !== '';
  return valueIsNotEmpty;
}

function validateDate(date) {
  const currentDate = new Date();
  const bookingDate = new Date(date);
  return new Date(currentDate) <= new Date(bookingDate);
}

module.exports = {
  validateStringInput,
  validateDate,
};
