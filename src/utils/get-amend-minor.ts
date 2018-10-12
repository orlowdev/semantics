import { CommitInterface } from '../interfaces/commit.interface';

export const getAmendMinor = (xs: CommitInterface[]): boolean => !!xs.find((x: CommitInterface) => x.type === 'feat');
