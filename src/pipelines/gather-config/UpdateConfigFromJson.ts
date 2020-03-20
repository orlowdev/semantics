import { ISemanticsIntermediate } from "../../interfaces/semantics-intermediate.interface";
import { promisify } from "util";
import { existsSync, readFile } from "fs";
import { join } from "path";
import { cwd } from "process";
import { Pipeline } from "@priestine/pipeline";

export const UpdateConfigFromJson = Pipeline.of(
  async (intermediate: ISemanticsIntermediate) => {
    const readFilePromise = promisify(readFile);
    const rcPath = join(cwd(), ".semantics.json");
    const rcExists = existsSync(rcPath);

    if (!rcExists) {
      return intermediate;
    }

    return {
      ...intermediate,
      ...JSON.parse(await readFilePromise(rcPath, "utf8")),
    };
  },
);
