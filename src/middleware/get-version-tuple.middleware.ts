import * as R from 'ramda';

const hasLatestVersionTag = R.pipe(
  R.path(['intermediate', 'latestVersionTag']),
  Boolean
);

const versionTuple = R.lensPath(['intermediate', 'versionTuple']);

const setVersionTuple = (value) => R.pipe(
  R.set(versionTuple, value),
  R.prop('intermediate')
);

const setDefaultVersionTuple = setVersionTuple([0, 0, 0]);

const getCurrentVersion = R.pipe(
  R.path(['intermediate', 'latestVersionTag']),
  R.match(/(\d+).(\d+).(\d+)/),
);

const setVersionTupleFromVersionTag = (ctx) =>
  setVersionTuple(R.map(Number, getCurrentVersion(ctx).slice(1, 4)))(ctx);

const hasCurrentVersion = R.pipe(
  getCurrentVersion,
  R.prop('length'),
  Boolean,
);

export const getVersionTuple = R.ifElse(
  R.allPass([hasLatestVersionTag, hasCurrentVersion]),
  setVersionTupleFromVersionTag,
  setDefaultVersionTuple
);
