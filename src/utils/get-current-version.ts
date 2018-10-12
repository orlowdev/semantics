import { parseInteger } from './parse-integer';

export const getCurrentVersion = (currentTag: string): [number, number, number] => {
  const currentVersion = currentTag.match(/^(\d+).(\d+).(\d+)/);
  if (!currentVersion || !currentVersion[1]) {
    return [0, 0, 0];
  }
  if (!currentVersion[2]) {
    return [parseInteger(currentVersion[1]), 0, 0];
  }

  if (!currentVersion[3]) {
    return [parseInteger(currentVersion[1]), parseInteger(currentVersion[2]), 0];
  }
  return [parseInteger(currentVersion[1]), parseInteger(currentVersion[2]), parseInteger(currentVersion[3])];
};
