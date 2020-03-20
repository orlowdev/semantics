import { ISemanticsIntermediate } from "../../interfaces/semantics-intermediate.interface";
import { transformCase } from "@priestine/case-transformer/src";
import { fromArgv } from "../../utils/from-argv.util";
import { Pipeline } from "@priestine/pipeline";

export const UpdateConfigFromArgv = (argv: string[]) =>
  Pipeline.of((intermediate: ISemanticsIntermediate) => {
    Object.keys(intermediate).forEach((key) => {
      const argvKey = `--${transformCase(key).from.camel.to.kebab.toString()}`;
      const getFromArgv = fromArgv(argv.filter((arg) => /^--.*=?/.test(arg)));

      if (typeof intermediate[key] === "number") {
        intermediate[key] = Number.isInteger(intermediate[key])
          ? getFromArgv(argvKey, intermediate[key], Number.parseInt)
          : getFromArgv(argvKey, intermediate[key], Number.parseFloat);
      } else if (typeof intermediate[key] === "boolean") {
        intermediate[key] =
          getFromArgv(argvKey, String(intermediate[key])) === "true";
      } else {
        intermediate[key] = getFromArgv(argvKey, intermediate[key]);
      }
    });

    return intermediate;
  });
