import { IntermediatePipeline } from "@priestine/pipeline";
import { Log } from "../utils/log.util";
import * as R from "ramda";
import { exit } from "../utils/exit.util";

const newCommitsExist = R.pipe(
  R.path(["intermediate", "commitsSinceLatestVersion", "length"]),
  Boolean,
);

const handleCommitsFoundForUpdate = R.prop("intermediate");

const handleNoCommits = R.pipe(
  Log.tapWarning("There are no changes since last release. Terminating."),
  exit(0),
);

export const exitIfThereAreNoNewCommits = R.ifElse(
  newCommitsExist,
  handleCommitsFoundForUpdate,
  handleNoCommits,
);

export const ExitIfNoCommits = IntermediatePipeline.of(
  exitIfThereAreNoNewCommits,
);
