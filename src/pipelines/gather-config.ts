import { IntermediatePipeline } from "@priestine/pipeline";
import { TSemanticsCtx } from "../interfaces/semantics-intermediate.interface";
import { fromArgv } from "../utils/from-argv.util";
import { transformCase } from "@priestine/case-transformer/src";
import { fromEnv } from "../utils/from-env.util";
import ProcessEnv = NodeJS.ProcessEnv;

const updateConfigFromArgv = (argv: string[]) => {
  return ({ intermediate }: TSemanticsCtx) => {
    Object.keys(intermediate).forEach((key) => {
      const argvKey = `--${transformCase(key).from.camel.to.kebab.toString()}`;
      const getFromArgv = fromArgv(argv.filter((arg) => /^--.*=?/.test(arg)));

      if (typeof intermediate[key] === "number") {
        intermediate[key] = Number.isInteger(intermediate[key])
          ? Number.parseInt(getFromArgv(argvKey, intermediate[key]))
          : Number.parseFloat(getFromArgv(argvKey, intermediate[key]));
      } else if (typeof intermediate[key] === "boolean") {
        intermediate[key] =
          getFromArgv(argvKey, String(intermediate[key])) === "true";
      } else {
        intermediate[key] = getFromArgv(argvKey, intermediate[key]);
      }
    });
  };
};

const updateConfigFromEnv = (env: ProcessEnv) => {
  return ({ intermediate }: TSemanticsCtx) => {
    Object.keys(intermediate).forEach((key) => {
      const envKey = transformCase(key)
        .from.camel.to.snake.toString()
        .toUpperCase();
      const getFromEnv = fromEnv(env);

      if (typeof intermediate[key] === "number") {
        intermediate[key] = Number.isInteger(intermediate[key])
          ? Number.parseInt(getFromEnv(envKey, intermediate[key]))
          : Number.parseFloat(getFromEnv(envKey, intermediate[key]));
      } else if (typeof intermediate[key] === "boolean") {
        intermediate[key] =
          getFromEnv(envKey, String(intermediate[key])) === "true";
      } else {
        intermediate[key] = getFromEnv(envKey, intermediate[key]);
      }
    });

    return intermediate;
  };
};

export const GatherConfig = IntermediatePipeline.of(
  updateConfigFromArgv(process.argv.slice(2)),
).concat(IntermediatePipeline.of(updateConfigFromEnv(process.env)));
