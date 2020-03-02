import { IntermediatePipeline } from "@priestine/pipeline";
import { Log } from "../utils/log.util";
import { Iro } from "@priestine/iro/src";
import * as R from "ramda";
import { exit } from "../utils/exit.util";

const versionHasNotChanged = R.lift(R.equals)(
  R.path(["intermediate", "newVersion"]),
  R.path(["intermediate", "latestVersionTag"]),
);

const handleUnchangedVersion = R.pipe(
  Log.tapWarning(
    "Evaluated changes do not require version bumping. Terminating.",
  ),
  exit(0),
);

const logVersionCandidate = ({ intermediate }) =>
  Log.tapSuccess(
    `New version candidate: ${Iro.green(`${intermediate.newVersion}`)}`,
  )(intermediate);

const handleChangedVersion = R.pipe(
  logVersionCandidate,
  R.prop("intermediate"),
);

export const exitIfVersionIsNotUpdated = R.ifElse(
  versionHasNotChanged,
  handleUnchangedVersion,
  handleChangedVersion,
);

export const ExitIfNoBumping = IntermediatePipeline.of(
  exitIfVersionIsNotUpdated,
);
