import { ISemanticsIntermediate } from "../../interfaces/semantics-intermediate.interface";
import { transformCase } from "@priestine/case-transformer/src";
import { fromEnv } from "../../utils/from-env.util";
import { Pipeline } from "@priestine/pipeline";
import ProcessEnv = NodeJS.ProcessEnv;

export const UpdateConfigFromEnv = (env: ProcessEnv) =>
  Pipeline.of((intermediate: ISemanticsIntermediate) => {
    Object.keys(intermediate).forEach((key) => {
      const envKey = transformCase(key)
        .from.camel.to.snake.toString()
        .toUpperCase();

      const getFromEnv = fromEnv(env);

      if (typeof intermediate[key] === "number") {
        intermediate[key] = Number.isInteger(intermediate[key])
          ? getFromEnv(envKey, intermediate[key], Number.parseInt)
          : getFromEnv(envKey, intermediate[key], Number.parseFloat);
      } else if (typeof intermediate[key] === "boolean") {
        intermediate[key] =
          getFromEnv(envKey, String(intermediate[key])) === "true";
      } else {
        intermediate[key] = getFromEnv(envKey, intermediate[key]);
      }
    });

    return intermediate;
  });
