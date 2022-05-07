// string manipulation helper

/**
 * truncate string
 * @param {string} str
 * @returns truncated string (ex: abcde...)
 */
export const truncateString = str => {
  return str.length > 45 ? str.substring(0, 44) + '...' : str;
};
