export const getPrivateToken = (): string => {
  const ptRx = /--private-token=/;

  const tokenFromArgs = process.argv.find((x: string) => ptRx.test(x));

  return tokenFromArgs ? tokenFromArgs.replace(ptRx, '') : process.env.PRIVATE_TOKEN;
};
