import { CommitInterface } from '../interfaces/commit.interface';

export const getAmendMajor = (xs: CommitInterface[]): boolean => !!xs.find((x: CommitInterface) => x.breakingChanges);
