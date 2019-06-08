import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { CommitInterface } from '../interfaces/commit.interface';

export function reverseCommitsArrayIfRequired({ intermediate }: SemanticsCtx) {
  if (intermediate.oldestCommitsFirst) {
    Log.info('Commits will be put oldest to newest.');
  }

  return {
    ...intermediate,
    commitsSinceLatestVersion: intermediate.oldestCommitsFirst
      ? (intermediate.commitsSinceLatestVersion as CommitInterface[]).reverse()
      : intermediate.commitsSinceLatestVersion,
  };
}
