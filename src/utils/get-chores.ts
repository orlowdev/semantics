import { CommitInterface } from '../interfaces/commit.interface';

export const getChores = (xs: CommitInterface[]): string[] =>
  xs
    .filter((x: CommitInterface) => ['chore', 'docs', 'style', 'refactor', 'test', 'build', 'ci'].includes(x.type))
    .map((x: CommitInterface) => `${x.abbrevHash} ${x.type}: ${x.subject}`);
