import { ISemanticsIntermediate } from "../interfaces/semantics-intermediate.interface";
import { UpdateConfigFromEnv } from "./gather-config/UpdateConfigFromEnv";
import { UpdateConfigFromArgv } from "./gather-config/UpdateConfigFromArgv";
import { IntermediatePipeline } from "@priestine/pipeline";
import { UpdateConfigFromJson } from "./gather-config/UpdateConfigFromJson";

export const DefaultConfig = {
  user: "",
  password: "",
  publishTag: true,
  oldestCommitsFirst: true,
  commitTypesIncludedInTagMessage: [
    {
      type: "feat",
      title: "New features",
      bumps: "minor",
    },
    {
      type: "fix",
      title: "Bug fixes",
      bumps: "patch",
    },
  ],
  commitTypesExcludedFromTagMessage: [],
  prefix: "",
  postfix: "",
  writeTemporaryFiles: false,
  preciseVersionMatching: true,
  excludeMerges: true,
  writeToChangelog: true,
  origin: "",
  gitUserName: "",
  gitUserEmail: "",
} as ISemanticsIntermediate;

export const GatherConfig = IntermediatePipeline.empty<ISemanticsIntermediate>()
  .concat(UpdateConfigFromJson)
  .concat(UpdateConfigFromArgv(process.argv.slice(2)))
  .concat(UpdateConfigFromEnv(process.env));
