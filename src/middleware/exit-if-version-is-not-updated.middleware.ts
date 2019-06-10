import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';
import { fork } from '../utils/fork.util';
import * as R from 'ramda';

const versionUpdated = R.lift(R.equals)(
  R.path(['intermediate', 'newVersion']),
  R.path(['intermediate', 'latestVersionTag'])
);

const handleSameVersion = () => {
  Log.warning('Evaluated changes do not require version bumping. Terminating.');
  return process.exit(0);
};

const handleVersionUpdate = ({ intermediate }: SemanticsCtx) => {
  Log.success(`New version candidate: ${Iro.green(`${intermediate.newVersion}`)}`);

  return intermediate;
};

export const exitIfVersionIsNotUpdated = fork(versionUpdated, handleSameVersion, handleVersionUpdate);
