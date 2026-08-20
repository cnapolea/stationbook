function validateStringInput(value) {
  const valueLength = value.length !== 0;
  const valueIsNotEmpty = value.trim() !== '';
  return valueLength && valueIsNotEmpty;
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
