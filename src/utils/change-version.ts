import { getCurrentVersion } from './get-current-version';

/**
 * Amend version based on current tag and provided version change requirements.
 * @param currentTag String representing current git tag
 */
export const changeVersion = (currentTag: string) => {
  const current = getCurrentVersion(currentTag);

  return (major: boolean, minor: boolean, patch: boolean): string => {
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
};
