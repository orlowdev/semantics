import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { transformCase } from '../utils/case-transformer.util';
import { fromEnv } from '../utils/from-env.util';
import ProcessEnv = NodeJS.ProcessEnv;

export function updateConfigFromEnv(env: ProcessEnv) {
  return ({ intermediate }: SemanticsCtx) => {
    Object.keys(intermediate).forEach((key) => {
      const envKey = transformCase(key)
        .from.camel.to.snake.toString()
        .toUpperCase();
      const getFromEnv = fromEnv(env);

      if (typeof intermediate[key] === 'number') {
        intermediate[key] = Number.isInteger(intermediate[key])
          ? Number.parseInt(getFromEnv(envKey, intermediate[key]))
          : Number.parseFloat(getFromEnv(envKey, intermediate[key]));
      } else if (typeof intermediate[key] === 'boolean') {
        intermediate[key] = getFromEnv(envKey, String(intermediate[key])) === 'true';
      } else {
        intermediate[key] = getFromEnv(envKey, intermediate[key]);
      }
    });

    return intermediate;
  };
}
