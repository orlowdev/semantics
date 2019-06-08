#!/usr/bin/env node

import { Pipeline } from '@priestine/data';
import { Log } from './utils/log.util';
import { getVersionTuple } from './middleware/get-version-tuple.middleware';
import { SemanticsIntermediate } from './interfaces/semantics-intermediate.interface';
import { updateConfigFromArgv } from './middleware/update-config-from-argv.middleware';
import { updateConfigFromEnv } from './middleware/update-config-from-env.middleware';
import { setUpDefaultConfig } from './middleware/set-up-default-config.middleware';
import { bumpMajorVersion, bumpMinorVersion, bumpPatchVersion } from './middleware/bump-version.middleware';
import { reverseCommitsArrayIfRequired } from './middleware/reverse-commits-array-if-required.middleware';
import { normalizeCommitsString } from './middleware/normalize-commits-string.middleware';
import { writeTemporaryFilesIfRequired } from './middleware/write-temporary-files-if-required.middleware';
import { buildTagMessageIfRequired } from './middleware/build-tag-message-if-required.middleware';
import { exitIfThereAreNoNewCommits } from './middleware/exit-if-there-are-no-new-commits.middleware';
import { publishTagIfRequired } from './middleware/publish-tag-if-required.middleware';
import { exitIfVersionIsNotUpdated } from './middleware/exit-if-version-is-not-updated.middleware';
import { addPrefixAndPostfixToNewVersion } from './middleware/add-prefix-and-postfix-to-new-version.middleware';
import { transformCommitsStringToObjects } from './middleware/transform-commits-string-to-objects.middleware';
import { getCommitsSinceLatestVersion } from './middleware/get-commits-since-latest-version.middleware';
import { getLatestVersionCommitHash } from './middleware/get-latest-version-commit-hash.middleware';
import { getLatestVersionTag } from './middleware/get-latest-version-tag.middleware';
import { getCurrentCommitHash } from './middleware/get-current-commit-hash.middleware';

// TODO: tests
// TODO: * as *
// TODO: extract logging
// TODO: rewrite exitIf* middleware with generic exitIf
// TODO: rewrite *IfRequired middleware with HoF `optionally`

Pipeline.from([
  setUpDefaultConfig,
  updateConfigFromArgv(process.argv.slice(2)),
  updateConfigFromEnv(process.env),
  getCurrentCommitHash,
  getLatestVersionTag,
  getLatestVersionCommitHash,
  getCommitsSinceLatestVersion,
  normalizeCommitsString,
  transformCommitsStringToObjects,
  exitIfThereAreNoNewCommits,
  reverseCommitsArrayIfRequired,
  getVersionTuple,
  bumpPatchVersion,
  bumpMinorVersion,
  bumpMajorVersion,
  addPrefixAndPostfixToNewVersion,
  exitIfVersionIsNotUpdated,
  buildTagMessageIfRequired,
  writeTemporaryFilesIfRequired,
  publishTagIfRequired,
])
  .process({
    intermediate: {} as SemanticsIntermediate,
  })
  .catch((e) => {
    Log.error(e.replace('\n', '->'));
    process.exit(1);
  });
