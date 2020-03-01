import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';
import { execPromise } from '../utils/exec-promise.util';

export function publishTagIfRequired({ intermediate }: SemanticsCtx) {
  if (!intermediate.publishTag) {
    Log.info('Skipping publishing newly created tag...');

    return intermediate;
  }

  if (!intermediate.privateToken) {
    Log.error('Private token not specified');
    process.exit(1);
  }

  execPromise(`git tag --annotate ${intermediate.newVersion} --message "${intermediate.tagMessageContents}"`)
    .then(() => execPromise('git push --tags'))
    .then(() => Log.success(`Version ${Iro.bold(Iro.green(intermediate.newVersion))} successfully released! 🙌`))
    .catch((e: Error) => Log.error(e.message));
}
