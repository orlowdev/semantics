import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { execPromise } from '../utils/exec-promise.util';
import { Log } from '../utils/log.util';
import { commitFormat } from '../commit-format';

export function getCommitsSinceLatestVersion({ intermediate }: SemanticsCtx) {
  return execPromise(
    `git rev-list ${intermediate.latestVersionCommitHash}..HEAD --no-merges --format='${commitFormat}'`
  )
    .then((commitsSinceLatestVersionString) => ({
      ...intermediate,
      commitsSinceLatestVersionString,
    }))
    .catch((e) => {
      Log.error(e.replace('\n', '->'));
      process.exit(1);
    });
}
