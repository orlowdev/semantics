import { CommitInterface } from '../interfaces/commit.interface';

export const getReverts = (xs: CommitInterface[]): string[] =>
  xs
    .filter((x: CommitInterface) => x.type === 'revert')
    .map((x: CommitInterface) => `${x.abbrevHash} ${x.type}: ${x.subject}`);
