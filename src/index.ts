#!/usr/bin/env node

import { IntermediatePipeline } from '@priestine/pipeline';
import { Log } from './utils/log.util';
import { getVersionTuple } from './middleware/get-version-tuple.middleware';
import { SemanticsIntermediate } from './interfaces/semantics-intermediate.interface';
import { updateConfigFromArgv } from './middleware/update-config-from-argv.middleware';
import { updateConfigFromEnv } from './middleware/update-config-from-env.middleware';
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

const GatherConfigPipeline = IntermediatePipeline.from([
  updateConfigFromArgv(process.argv.slice(2)),
  updateConfigFromEnv(process.env),
]);

const GitCommandsPipeline = IntermediatePipeline.from([
  getCurrentCommitHash,
  getLatestVersionTag,
  getLatestVersionCommitHash,
  getCommitsSinceLatestVersion,
]);

const NormalizeCommitsPipeline = IntermediatePipeline.from([normalizeCommitsString, transformCommitsStringToObjects]);

const ExitIfNoCommits = IntermediatePipeline.of(exitIfThereAreNoNewCommits);

const BuildNewVersionPipeline = IntermediatePipeline.from([
  getVersionTuple,
  bumpPatchVersion,
  bumpMinorVersion,
  bumpMajorVersion,
  addPrefixAndPostfixToNewVersion,
]);

const ExitIfNoBumping = IntermediatePipeline.of(exitIfVersionIsNotUpdated);

const ApplyVersioningPipeline = IntermediatePipeline.from([
  reverseCommitsArrayIfRequired,
  buildTagMessageIfRequired,
  writeTemporaryFilesIfRequired,
  publishTagIfRequired,
]);

GatherConfigPipeline.concat(GitCommandsPipeline)
  .concat(NormalizeCommitsPipeline)
  .concat(ExitIfNoCommits)
  .concat(BuildNewVersionPipeline)
  .concat(ExitIfNoBumping)
  .concat(ApplyVersioningPipeline)
  .process({
    user: '',
    password: '',
    publishTag: true,
    oldestCommitsFirst: true,
    commitTypesIncludedInTagMessage: [
      {
        type: 'feat',
        title: 'New features',
        bumps: 'minor',
      },
      {
        type: 'fix',
        title: 'Bug fixes',
        bumps: 'patch',
      },
    ],
    commitTypesExcludedFromTagMessage: [],
    prefix: '',
    postfix: '',
    writeTemporaryFiles: false,
    preciseVersionMatching: true,
    excludeMerges: true,
    writeToChangelog: true,
    origin: '',
    gitUserName: '',
    gitUserEmail: '',
  } as SemanticsIntermediate)
  .catch((e) => {
    Log.error(e);
    process.exit(1);
  });
