#!/usr/bin/env node

import { Log } from "./utils/log.util";
import { DefaultConfig, GatherConfig } from "./pipelines/gather-config";
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
  .process(DefaultConfig)
  .catch((e) => {
    Log.error(e);
    process.exit(1);
  });
