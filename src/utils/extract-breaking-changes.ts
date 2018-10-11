import { CommitInterface } from '../interfaces/commit.interface';

export const extractBreakingChanges = (commit: CommitInterface): CommitInterface => {
  commit.breakingChanges = !!commit.body.find((x: string) => /^BREAKING\sCHANGE:/.test(x));

  return commit;
};
