import { getCurrentVersion } from './get-current-version';

export const changeVersion = (currentTag: string) => (major: boolean, minor: boolean, patch: boolean): string => {
  const current = getCurrentVersion(currentTag);

  if (!current[0]) {
    return '1.0.0';
  }

  if (major) {
    return `${current[0] + 1}.0.0`;
  }

  if (minor) {
    return `${current[0]}.${current[1] + 1}.0`;
  }

  if (patch) {
    return `${current[0]}.${current[1]}.${current[1] + 1}`;
  }

  return `${current[0]}.${current[1]}.${current[2]}`;
};
