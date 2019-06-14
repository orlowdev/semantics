export function fromArgv(argv: string[]) {
  return (key: string, defaultVal = '', transformer = (x) => x): string => {
    if (!argv) {
      return transformer(defaultVal);
    }

    const args = argv.reduce((acc, arg) => {
      let [key, value] = arg.split('=');

      if (!value) {
        value = 'true';
      }

      acc[key] = value;
      return acc;
    }, {});

    return transformer(args[key] || defaultVal);
  };
}
