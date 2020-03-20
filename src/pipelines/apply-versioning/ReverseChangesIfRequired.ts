import { Log } from "../../utils/log.util";
import { TSemanticsCtx } from "../../interfaces/semantics-intermediate.interface";
import { IntermediatePipeline } from "@priestine/pipeline";

const logChangesOrder = ({ intermediate }) =>
  Log.tapInfo(
    intermediate.oldestCommitsFirst
      ? "Changes will be ordered by commit date in ascending order (oldest first)."
      : "Changes will be ordered by commit date in descending order (newest first).",
  )(intermediate);

const setChangesOrder = ({ intermediate }: TSemanticsCtx) => ({
  ...intermediate,
  commitsSinceLatestVersion: intermediate.oldestCommitsFirst
    ? intermediate.commitsSinceLatestVersion.reverse()
    : intermediate.commitsSinceLatestVersion,
});

export const ReverseChangesIfRequired = IntermediatePipeline.from([
  logChangesOrder,
  setChangesOrder,
]);
