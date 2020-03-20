import { Log } from "../../utils/log.util";
import { ISemanticsIntermediate } from "../../interfaces/semantics-intermediate.interface";
import { Pipeline } from "@priestine/pipeline";

const logChangesOrder = (intermediate) =>
  Log.tapInfo(
    intermediate.oldestCommitsFirst
      ? "Changes will be ordered by commit date in ascending order (oldest first)."
      : "Changes will be ordered by commit date in descending order (newest first).",
  )(intermediate);

const setChangesOrder = (intermediate: ISemanticsIntermediate) => ({
  ...intermediate,
  commitsSinceLatestVersion: intermediate.oldestCommitsFirst
    ? intermediate.commitsSinceLatestVersion.reverse()
    : intermediate.commitsSinceLatestVersion,
});

export const ReverseChangesIfRequired = Pipeline.from([
  logChangesOrder,
  setChangesOrder,
]);
