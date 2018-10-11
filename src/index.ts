import { Shell } from '@totemish/shell';
import { execPromise } from './utils/exec-promise';
import { catchError } from './utils/catch-promise';
import { commitFormat } from './utils/commit-format';
import { normalizeChanges } from './utils/normalize-changes';

execPromise('git rev-parse HEAD')
  .then((currentCommit: string) => {
    execPromise('git rev-parse --abbrev-ref HEAD')
      .then((branch: string) => {
        execPromise('git describe --tags `git rev-list --tags --max-count=1`')
        .then((currentTag: string) => {
          execPromise(`git show-ref ${currentTag} -s`)
          .then((latestTaggedCommit: string) => {
            execPromise(`git rev-list ${latestTaggedCommit}..HEAD --no-merges --format='${commitFormat}'`)
            .then((changes: string) => {
              Shell.write(JSON.parse(normalizeChanges(changes)));
            })
            .catch(catchError);
          })
          .catch(catchError);
        })
        .catch(catchError);
      })
      .catch(catchError);
  })
  .catch(catchError);
