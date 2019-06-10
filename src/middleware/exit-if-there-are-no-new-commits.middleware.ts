import { Log } from '../utils/log.util';
import * as R from 'ramda';
import { fork } from '../utils/fork.util';
import { intermediateId } from '../utils/intermediate-id.util';

const newCommitsExist = R.pipe(
  R.path(['intermediate', 'commitsSinceLatestVersion', 'length']),
  Boolean
);

export const exitIfThereAreNoNewCommits = fork(newCommitsExist, intermediateId, () => {
  Log.warning('There are no changes since last release. Terminating.');
  process.exit(0);
});
