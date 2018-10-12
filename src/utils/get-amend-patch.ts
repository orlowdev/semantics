import { CommitInterface } from '../interfaces/commit.interface';

export const getAmendPatch = (xs: CommitInterface[]): boolean =>
  !!xs.find((x: CommitInterface) => ['perf', 'fix'].includes(x.type));
