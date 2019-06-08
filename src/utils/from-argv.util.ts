export function fromArgv(argv: string[]) {
  const args = argv.reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    acc[key] = value;
    return acc;
  }, {});
  return (key: string, defaultVal = '', transformer = (x) => x): string => {
    if (!argv) {
      return defaultVal;
    }

    return transformer(args[key]) || defaultVal;
  };
}
