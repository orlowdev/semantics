import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';

export function exitIfVersionIsNotUpdated({ intermediate }: SemanticsCtx) {
  if (intermediate.latestVersionTag === intermediate.newVersion) {
    Log.warning('Evaluated changes do not require version bumping. Terminating.');
    return process.exit(0);
  }

  Log.success(`New version candidate: ${Iro.green(`${intermediate.newVersion}`)}`);

  return intermediate;
}
