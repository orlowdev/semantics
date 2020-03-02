import ProcessEnv = NodeJS.ProcessEnv;

export function fromEnv(env: ProcessEnv) {
  return (key: string, defaultVal = "", transformer = (x) => x): string => {
    if (!env) {
      return defaultVal;
    }

    return transformer(env[key]) || defaultVal;
  };
}
