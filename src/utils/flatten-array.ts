/**
 * Flatten nested arrays.
 * @param {any[]} xs
 * @returns {any[]}
 */
export const flatten = (xs: any[]) =>
  Array.from(new Set(xs.reduce((x, y) => x.concat(Array.isArray(y) ? flatten(y) : y), [])));
