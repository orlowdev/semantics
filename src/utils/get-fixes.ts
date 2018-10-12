import { CommitInterface } from '../interfaces/commit.interface';

export const getFixes = (xs: CommitInterface[]): string[] =>
  xs
    .filter((x: CommitInterface) => x.type === 'fix')
    .map((x: CommitInterface) => `${x.abbrevHash} ${x.type}: ${x.subject}`);
