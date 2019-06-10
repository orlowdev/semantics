import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';
import * as R from 'ramda';

const versionHasNotChanged = R.lift(R.equals)(
  R.path(['intermediate', 'newVersion']),
  R.path(['intermediate', 'latestVersionTag'])
);

const handleUnchangedVersion = () => {
  Log.warning('Evaluated changes do not require version bumping. Terminating.');
  return process.exit(0);
};

const handleChangedVersion = ({ intermediate }: SemanticsCtx) => {
  Log.success(`New version candidate: ${Iro.green(`${intermediate.newVersion}`)}`);

  return intermediate;
};

export const exitIfVersionIsNotUpdated = R.ifElse(versionHasNotChanged, handleUnchangedVersion, handleChangedVersion);
