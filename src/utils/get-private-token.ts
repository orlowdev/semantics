/**
 * Get private token from argv or PRIVATE_TOKEN env variable.
 * @returns {string}
 */
export const getPrivateToken = (): string => {
  let token: string;

  const ptRx = /--private-token=/;
  const tokenFromArgs = process.argv.find((x: string) => ptRx.test(x));

  return tokenFromArgs && (token = tokenFromArgs.replace(ptRx, '')) && token
    ? token
    : process.env.PRIVATE_TOKEN
      ? process.env.PRIVATE_TOKEN
      : '';
};
