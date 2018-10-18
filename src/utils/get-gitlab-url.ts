export const getGitLabURL = (): string => {
  let url: string;

  const ptRx = /--custom-domain=/;
  const urlFromArgs = process.argv.find((x: string) => ptRx.test(x));

  return urlFromArgs && (url = urlFromArgs.replace(ptRx, '')) ? url : 'https://gitlab.com/api/v4';
};
