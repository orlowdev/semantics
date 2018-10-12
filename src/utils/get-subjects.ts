import { CommitInterface } from '../interfaces/commit.interface';
import { CommitTypes } from '../types/commit-types';

export const getSubjects = (xs: CommitInterface[]) => (type: keyof typeof CommitTypes): string[] =>
  xs
    .filter((x: CommitInterface) => x.type === type)
    .map((x: CommitInterface) => `${x.abbrevHash} ${x.type}: ${x.subject}`);
