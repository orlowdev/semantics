import { CommitInterface } from '../interfaces/commit.interface';

/**
 * Check if major version (MAJOR.x.x) should be raised.
 * @param xs CommitInterface[]
 * @returns boolean
 */
export const getAmendMajor = (xs: CommitInterface[]): boolean =>
  !!xs.find((x: CommitInterface) => !!x.breakingChanges.length);
