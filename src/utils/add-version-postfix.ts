/**
 * Add version postfix if it was provided.
 * @param {string} version
 * @returns {string}
 */
export const addVersionPostfix = (version: string) => {
  const rx = /--postfix=/;
  const postfix = process.argv.find((x: string) => rx.test(x));

  return postfix ? `${version}${postfix.replace(rx, '')}` : version;
};
