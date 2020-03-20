import { TSemanticsCtx } from "../../interfaces/semantics-intermediate.interface";
import { transformCase } from "@priestine/case-transformer/src";
import { fromEnv } from "../../utils/from-env.util";
import { IntermediatePipeline, Pipeline } from '@priestine/pipeline';
import ProcessEnv = NodeJS.ProcessEnv;

export const UpdateConfigFromEnv = (env: ProcessEnv) =>
  IntermediatePipeline.of(({ intermediate }: TSemanticsCtx) => {
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
  });
