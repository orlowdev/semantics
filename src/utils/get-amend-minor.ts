import { CommitInterface } from '../interfaces/commit.interface';

/**
 * Check if minor version (x.MINOR.x) should be raised.
 * @param xs CommitInterface[]
 * @returns boolean
 */
export const getAmendMinor = (xs: CommitInterface[]): boolean => !!xs.find((x: CommitInterface) => x.type === 'feat');
