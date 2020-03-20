import { Pipeline } from "@priestine/pipeline";
import { Log } from "../utils/log.util";
import * as R from "ramda";
import { exit } from "../utils/exit.util";

const newCommitsExist = R.pipe(
  R.path(["commitsSinceLatestVersion", "length"]),
  Boolean,
);

const handleCommitsFoundForUpdate = R.identity;

const handleNoCommits = R.pipe(
  Log.tapWarning("There are no changes since last release. Terminating."),
  exit(0),
);

export const exitIfThereAreNoNewCommits = R.ifElse(
  newCommitsExist,
  handleCommitsFoundForUpdate,
  handleNoCommits,
);

export const ExitIfNoCommits = Pipeline.of(exitIfThereAreNoNewCommits);
