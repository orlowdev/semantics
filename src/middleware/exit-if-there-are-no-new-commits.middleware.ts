import { Log } from '../utils/log.util';
import * as R from 'ramda';

const newCommitsExist = R.pipe(
  R.path(['intermediate', 'commitsSinceLatestVersion', 'length']),
  Boolean
);

const handleCommitsFoundForUpdate = R.prop('intermediate');

const handleNoCommits = () => {
  Log.warning('There are no changes since last release. Terminating.');
  process.exit(0);
};

export const exitIfThereAreNoNewCommits = R.ifElse(newCommitsExist, handleCommitsFoundForUpdate, handleNoCommits);
