import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';

export function bumpPatchVersion({ intermediate }: SemanticsCtx) {
  const currentVersionTuple = intermediate.versionTuple;

  if (intermediate.commitsSinceLatestVersion.some((commit) => commit.hasPatchUpdate)) {
    intermediate.newVersion = `${currentVersionTuple[0]}.${currentVersionTuple[1]}.${currentVersionTuple[2] + 1}`;
  }

  return intermediate;
}

export function bumpMinorVersion({ intermediate }: SemanticsCtx) {
  const currentVersionTuple = intermediate.versionTuple;

  if (intermediate.commitsSinceLatestVersion.some((commit) => commit.hasMinorUpdate)) {
    intermediate.newVersion = `${currentVersionTuple[0]}.${currentVersionTuple[1] + 1}.0`;
  }

  return intermediate;
}

export function bumpMajorVersion({ intermediate }: SemanticsCtx) {
  const currentVersionTuple = intermediate.versionTuple;

  if (intermediate.commitsSinceLatestVersion.some((commit) => commit.hasMajorUpdate) || !intermediate.newVersion) {
    intermediate.newVersion = `${currentVersionTuple[0] + 1}.0.0`;
  }

  return intermediate;
}
