import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { transformCase } from '@priestine/case-transformer';
import { fromArgv } from '../utils/from-argv.util';

export function updateConfigFromArgv(argv: string[]) {
  return ({ intermediate }: SemanticsCtx) => {
    Object.keys(intermediate).forEach((key) => {
      const argvKey = `--${transformCase(key).from.camel.to.kebab.toString()}`;
      const getFromArgv = fromArgv(argv.filter((arg) => /^--.*=?/.test(arg)));

      if (typeof intermediate[key] === 'number') {
        intermediate[key] = Number.isInteger(intermediate[key])
          ? Number.parseInt(getFromArgv(argvKey, intermediate[key]))
          : Number.parseFloat(getFromArgv(argvKey, intermediate[key]));
      } else if (typeof intermediate[key] === 'boolean') {
        intermediate[key] = getFromArgv(argvKey, String(intermediate[key])) === 'true';
      } else {
        intermediate[key] = getFromArgv(argvKey, intermediate[key]);
      }
    });
  };
}
