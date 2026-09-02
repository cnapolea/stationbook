const getHourAndMinutes = (dateObj) => {
  const date = new Date(dateObj);
  const options = {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return date.toLocaleTimeString('en-US', options);
};

export default getHourAndMinutes;
