#!/usr/bin/env node

import { Log } from "./utils/log.util";
import { ISemantics } from "./interfaces/semantics-intermediate.interface";
import { GatherConfig } from "./pipelines/gather-config";
import { GetCommitsSinceLatestVersion } from "./pipelines/get-commits-since-latest-version";
import { NormalizeCommits } from "./pipelines/normalize-commits";
import { ExitIfNoCommits } from "./pipelines/exit-if-no-commits";
import { ExitIfNoBumping } from "./pipelines/exit-if-no-bumping";
import { BuildNewVersion } from "./pipelines/build-new-version";
import { ApplyVersioning } from "./pipelines/apply-versioning";

GatherConfig.concat(GetCommitsSinceLatestVersion)
  .concat(NormalizeCommits)
  .concat(ExitIfNoCommits)
  .concat(BuildNewVersion)
  .concat(ExitIfNoBumping)
  .concat(ApplyVersioning)
  .process({
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
  } as ISemantics)
  .catch((e) => {
    Log.error(e);
    process.exit(1);
  });
