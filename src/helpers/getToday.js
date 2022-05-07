/**
 * Get a string of today's date
 * @param {string} separator - The date valid separator (E.g. '-', '/').
 * @return {string} Today's date (E.g. '017-02-15')
 */
const getToday = (separator = '-') => {
  // Add leading zero to day and month if needed
  // E.g. if month is 1, then 01, but if 10, then still 10
  const pad = num => num.toString().padStart(2, '0');

  // Construct today's date
  const date = new Date();
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const today = [year, month, day].join(separator);

  return today;
};

export default getToday;
