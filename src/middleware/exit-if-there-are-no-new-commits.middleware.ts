import { Log } from '../utils/log.util';
import * as R from 'ramda';
import { intermediateId } from '../utils/intermediate-id.util';

const newCommitsExist = R.pipe(
  R.path(['intermediate', 'commitsSinceLatestVersion', 'length']),
  Boolean
);

const handleCommitsFoundForUpdate = intermediateId;

const handleNoCommits = () => {
  Log.warning('There are no changes since last release. Terminating.');
  process.exit(0);
};

export const exitIfThereAreNoNewCommits = R.ifElse(newCommitsExist, handleCommitsFoundForUpdate, handleNoCommits);
