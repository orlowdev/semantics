import { IntermediatePipeline } from "@priestine/pipeline";
import * as R from "ramda";
import { SemanticsCtx } from "../interfaces/semantics-intermediate.interface";

const hasLatestVersionTag = R.pipe(
  R.path(["intermediate", "latestVersionTag"]),
  Boolean,
);

const versionTuple = R.lensPath(["intermediate", "versionTuple"]);

const setVersionTuple = (value) =>
  R.pipe(
    R.set(versionTuple, value),
    R.prop("intermediate"),
  );

const setDefaultVersionTuple = setVersionTuple([0, 0, 0]);

const getCurrentVersion = R.pipe(
  R.path(["intermediate", "latestVersionTag"]),
  R.match(/(\d+).(\d+).(\d+)/),
);

const setVersionTupleFromVersionTag = (ctx) =>
  setVersionTuple(R.map(Number, getCurrentVersion(ctx).slice(1, 4)))(ctx);

const currentVersionTagIsValid = R.pipe(
  getCurrentVersion,
  R.prop("length"),
  Boolean,
);

export const getVersionTuple = R.ifElse(
  R.allPass([hasLatestVersionTag, currentVersionTagIsValid]),
  setVersionTupleFromVersionTag,
  setDefaultVersionTuple,
);

export function bumpPatchVersion({ intermediate }: SemanticsCtx) {
  const currentVersionTuple = intermediate.versionTuple;

  if (
    intermediate.commitsSinceLatestVersion.some(
      (commit) => commit.hasPatchUpdate,
    )
  ) {
    intermediate.newVersion = `${currentVersionTuple[0]}.${
      currentVersionTuple[1]
    }.${currentVersionTuple[2] + 1}`;
  }

  return intermediate;
}

export function bumpMinorVersion({ intermediate }: SemanticsCtx) {
  const currentVersionTuple = intermediate.versionTuple;

  if (
    intermediate.commitsSinceLatestVersion.some(
      (commit) => commit.hasMinorUpdate,
    )
  ) {
    intermediate.newVersion = `${
      currentVersionTuple[0]
    }.${currentVersionTuple[1] + 1}.0`;
  }

  return intermediate;
}

export function addPrefixAndPostfixToNewVersion({
  intermediate,
}: SemanticsCtx) {
  return {
    ...intermediate,
    newVersion: `${intermediate.prefix}${intermediate.newVersion}${
      intermediate.postfix
    }`,
  };
}

export function bumpMajorVersion({ intermediate }: SemanticsCtx) {
  const currentVersionTuple = intermediate.versionTuple;

  if (
    intermediate.commitsSinceLatestVersion.some(
      (commit) => commit.hasMajorUpdate,
    ) ||
    intermediate.versionTuple.every((x) => x === 0) ||
    intermediate.versionTuple[0] < 1
  ) {
    intermediate.newVersion = `${currentVersionTuple[0] + 1}.0.0`;
  }

  // TODO: Extract
  if (!intermediate.newVersion) {
    intermediate.newVersion = `${currentVersionTuple[0]}.${
      currentVersionTuple[1]
    }.${currentVersionTuple[2]}`;
  }

  return intermediate;
}

export const BuildNewVersion = IntermediatePipeline.from([
  getVersionTuple,
  bumpPatchVersion,
  bumpMinorVersion,
  bumpMajorVersion,
  addPrefixAndPostfixToNewVersion,
]);
