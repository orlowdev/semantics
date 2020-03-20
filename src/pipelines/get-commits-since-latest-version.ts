import { Pipeline } from "@priestine/pipeline";
import { ISemanticsIntermediate } from "../interfaces/semantics-intermediate.interface";
import { execPromise } from "../utils/exec-promise.util";
import { Log } from "../utils/log.util";
import { Iro } from "@priestine/iro/src";
import { commitFormat } from "../commit-format";
import { ExecPromiseErrorHandler } from "../utils/ExecPromiseErrorHandler";

const getCurrentCommitHash = (intermediate: ISemanticsIntermediate) =>
  execPromise("git rev-parse HEAD")
    .then((currentCommitHash) => {
      Log.success(`Current commit hash: ${Iro.green(currentCommitHash)}`);

      return {
        ...intermediate,
        currentCommitHash,
      };
    })
    .catch(ExecPromiseErrorHandler);

export function getCommitsSinceLatestVersion(
  intermediate: ISemanticsIntermediate,
) {
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
    .catch(ExecPromiseErrorHandler);
}

export function getLatestVersionTag(intermediate: ISemanticsIntermediate) {
  const glob = "*[0-9].*[0-9].*[0-9]";
  const matcher = intermediate.preciseVersionMatching
    ? `${intermediate.prefix}${glob}${intermediate.postfix}`
    : `*${glob}*`;

  Log.info(
    intermediate.preciseVersionMatching
      ? "Precise version matching is on, only the versions having the same prefix/postfix will be considered"
      : "Precise version matching is off, the latest semantic version will be referred to as previous version, " +
        "regardless of prefixes/postfixes",
  );

  return execPromise(`git describe --match "${matcher}" --abbrev=0 HEAD --tags`)
    .then((latestVersionTag) => {
      Log.success(`Latest version tag: ${Iro.green(latestVersionTag)}`);

      return {
        ...intermediate,
        latestVersionTag,
      };
    })
    .catch(() => {
      Log.warning("There seem to be no previous tags that match.");
      Log.warning("Initial commit hash will be considered the latest version.");

      return {
        ...intermediate,
        latestVersionTag: undefined,
      };
    });
}

export function getLatestVersionCommitHash(
  intermediate: ISemanticsIntermediate,
) {
  return (intermediate.latestVersionTag
    ? execPromise(`git show-ref ${intermediate.latestVersionTag} -s`)
    : execPromise("git rev-list HEAD | tail -n 1")
  )
    .then((latestVersionCommitHash) => {
      Log.success(
        `Commit hash of latest version: ${Iro.green(latestVersionCommitHash)}`,
      );

      return {
        ...intermediate,
        latestVersionCommitHash,
      };
    })
    .catch(ExecPromiseErrorHandler);
}

export const GetCommitsSinceLatestVersion = Pipeline.of(getCurrentCommitHash)
  .concat(Pipeline.of(getLatestVersionTag))
  .concat(Pipeline.of(getLatestVersionCommitHash))
  .concat(Pipeline.of(getCommitsSinceLatestVersion));
