import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';

export function exitIfThereAreNoNewCommits({ intermediate }: SemanticsCtx) {
  if (!intermediate.commitsSinceLatestVersion.length) {
    Log.warning('There are no changes since last release. Terminating.');
    process.exit(0);
  }

  return intermediate;
}
