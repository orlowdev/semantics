/**
 * Parse integer from given string containing a number.  If the string has no number, 0 will be returned.
 * @param x String containing a number.
 * @returns number
 */
export const parseInteger = (x: string): number => (/\d+/.test(x) ? Number.parseInt(x, 10) : 0);
