import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { execPromise } from '../utils/exec-promise.util';
import { Log } from '../utils/log.util';
import { commitFormat } from '../commit-format';

export function getCommitsSinceLatestVersion({ intermediate }: SemanticsCtx) {
  return execPromise(
    `git rev-list ${intermediate.latestVersionCommitHash}..${
      intermediate.currentCommitHash
    } --no-merges --format='${commitFormat}'`
  )
    .then((commitsSinceLatestVersion) => ({
      ...intermediate,
      commitsSinceLatestVersion,
    }))
    .catch((e) => {
      Log.error(e.replace('\n', '->'));
      process.exit(1);
    });
}
