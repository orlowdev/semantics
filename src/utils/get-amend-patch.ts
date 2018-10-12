import { CommitInterface } from '../interfaces/commit.interface';

/**
 * Check if patch version (x.x.PATCH) should be raised.
 * @param xs CommitInterface[]
 * @returns boolean
 */
export const getAmendPatch = (xs: CommitInterface[]): boolean =>
  !!xs.find((x: CommitInterface) => ['perf', 'fix'].includes(x.type));
