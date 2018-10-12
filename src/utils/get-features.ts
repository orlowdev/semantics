import { CommitInterface } from '../interfaces/commit.interface';

export const getFeatures = (xs: CommitInterface[]): string[] =>
  xs
    .filter((x: CommitInterface) => x.type === 'feat')
    .map((x: CommitInterface) => `${x.abbrevHash} ${x.type}: ${x.subject}`);
