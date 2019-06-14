import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { execPromise } from '../utils/exec-promise.util';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';

export function getLatestVersionCommitHash({ intermediate }: SemanticsCtx) {
  return (intermediate.latestVersionTag
    ? execPromise(`git show-ref ${intermediate.latestVersionTag} -s`)
    : execPromise('git rev-list HEAD | tail -n 1')
  ).then((latestVersionCommitHash) => {
    Log.success(`Commit hash of latest version: ${Iro.green(latestVersionCommitHash)}`);

    return {
      ...intermediate,
      latestVersionCommitHash,
    };
  });
}
