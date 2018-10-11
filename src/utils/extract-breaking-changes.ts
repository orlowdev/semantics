import { CommitInterface } from '../interfaces/commit.interface';

export const extractBreakingChanges = (commit: CommitInterface): CommitInterface => {
  commit.breakingChanges = !!commit.body.find((x: string) => /^BREAKING\sCHANGES:/.test(x));

  return commit;
};
