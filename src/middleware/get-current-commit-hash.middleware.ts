import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { execPromise } from '../utils/exec-promise.util';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';

export function getCurrentCommitHash({ intermediate }: SemanticsCtx) {
  return execPromise('git rev-parse HEAD')
    .then((currentCommitHash) => {
      Log.success(`Current commit hash: ${Iro.green(currentCommitHash)}`);

      return {
        ...intermediate,
        currentCommitHash,
      };
    })
    .catch((e) => {
      Log.error(e.replace('\n', '->'));
      process.exit(1);
    });
}
