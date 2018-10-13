import { CommitInterface } from '../interfaces/commit.interface';

/**
 * Extract breaking changes from commit body.
 * @param commit CommitInterface
 * @returns CommitInterface
 */
export const extractBreakingChanges = (commit: CommitInterface): CommitInterface => {
  commit.breakingChanges =
    commit.body
      .filter((x: string) => /^BREAKING\sCHANGE:/.test(x))
      .map((x: string) => x.replace(/^BREAKING\sCHANGE:/, '').trim()) || [];
  commit.body = commit.body.filter((x: string) => !/^BREAKING\sCHANGE:/.test(x));

  return commit;
};
