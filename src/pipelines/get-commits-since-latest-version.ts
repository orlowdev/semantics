import { IntermediatePipeline } from "@priestine/pipeline";
import { TSemanticsCtx } from "../interfaces/semantics-intermediate.interface";
import { execPromise } from "../utils/exec-promise.util";
import { Log } from "../utils/log.util";
import { Iro } from "@priestine/iro/src";
import { commitFormat } from "../commit-format";

const getCurrentCommitHash = ({ intermediate }: TSemanticsCtx) => {
  return execPromise("git rev-parse HEAD")
    .then((currentCommitHash) => {
      Log.success(`Current commit hash: ${Iro.green(currentCommitHash)}`);

      return {
        ...intermediate,
        currentCommitHash,
      };
    })
    .catch((e) => {
      Log.error(e.replace("\n", "->"));
      process.exit(1);
    });
};

export function getCommitsSinceLatestVersion({ intermediate }: TSemanticsCtx) {
  const noMerges = intermediate.excludeMerges ? "--no-merges " : "";
  return execPromise(
    `git rev-list ${
      intermediate.latestVersionCommitHash
    }..HEAD ${noMerges}--format='${commitFormat}'`,
  )
    .then((commitsSinceLatestVersionString) => ({
      ...intermediate,
      commitsSinceLatestVersionString,
    }))
    .catch((e) => {
      Log.error(e.replace("\n", "->"));
      process.exit(1);
    });
}

export function getLatestVersionTag({ intermediate }: TSemanticsCtx) {
  const glob = "*[0-9]";
  const matcher = intermediate.preciseVersionMatching
    ? `${intermediate.prefix}${glob}${intermediate.postfix}`
    : glob;

  return execPromise(`git describe --match "${matcher}" --abbrev=0 HEAD --tags`)
    .then((latestVersionTag) => {
      Log.success(`Latest version tag: ${Iro.green(latestVersionTag)}`);

      return {
        ...intermediate,
        latestVersionTag,
      };
    })
    .catch((e) => {
      Log.warning(
        `There seem to be no previous tags matching the "${Iro.yellow(
          `${intermediate.prefix}*${intermediate.postfix}`,
        )}" pattern.`,
      );
      Log.warning(`Initial commit hash will be considered the latest version.`);

      return {
        ...intermediate,
        latestVersionTag: undefined,
      };
    });
}

export function getLatestVersionCommitHash({ intermediate }: TSemanticsCtx) {
  return (intermediate.latestVersionTag
    ? execPromise(`git show-ref ${intermediate.latestVersionTag} -s`)
    : execPromise("git rev-list HEAD | tail -n 1")
  ).then((latestVersionCommitHash) => {
    Log.success(
      `Commit hash of latest version: ${Iro.green(latestVersionCommitHash)}`,
    );

    return {
      ...intermediate,
      latestVersionCommitHash,
    };
  });
}

export const GetCommitsSinceLatestVersion = IntermediatePipeline.of(
  getCurrentCommitHash,
)
  .concat(IntermediatePipeline.of(getLatestVersionTag))
  .concat(IntermediatePipeline.of(getLatestVersionCommitHash))
  .concat(IntermediatePipeline.of(getCommitsSinceLatestVersion));
