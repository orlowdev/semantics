import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';

export function getVersionTuple({ intermediate }: SemanticsCtx) {
  if (!intermediate.latestVersionTag) {
    return {
      ...intermediate,
      versionTuple: [0, 0, 0],
    };
  }

  const currentVersion = intermediate.latestVersionTag.match(/(\d+).(\d+).(\d+)/);
  const parseInteger = (x: string): number => (x ? (/\d+/.test(x) ? Number.parseInt(x, 10) : 0) : 0);

  if (!currentVersion || !currentVersion[1]) {
    return [0, 0, 0];
  }

  return {
    ...intermediate,
    versionTuple: [parseInteger(currentVersion[1]), parseInteger(currentVersion[2]), parseInteger(currentVersion[3])],
  };
}
