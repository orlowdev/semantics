/**
 * Add version prefix if it was provided.
 * @param {string} version
 * @returns {string}
 */
export const addVersionPrefix = (version: string) => {
  const rx = /--prefix=/;
  const prefix = process.argv.find((x: string) => rx.test(x));

  return prefix ? `${prefix.replace(rx, '')}${version}` : version;
};
