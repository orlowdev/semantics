#!/usr/bin/env node

import { Either, Task } from '@priestine/data/src';
import { Iro } from '@priestine/iro';
import * as R from 'ramda';
import { changeVersion } from './utils/change-version';
import { getAmendMajor } from './utils/get-amend-major';
import { getAmendMinor } from './utils/get-amend-minor';
import { getAmendPatch } from './utils/get-amend-patch';
import { addVersionPrefix } from './utils/add-version-prefix';
import { addVersionPostfix } from './utils/add-version-postfix';
import { CommitInterface } from './interfaces/commit.interface';
import { getChangelog } from './utils/build-changelog';
import { getChangesWith } from './utils/getChangesWith';
import { Messenger } from './utils/Messenger';
import { getCurrentCommitWith } from './utils/getCurrentCommitWith';
import { getLatestPublishedTagWith } from './utils/getLatestPublishedTagWith';
import { appendFixOrFeatFlags } from './utils/append-fix-or-feat-flags';
import { getGetChangesCommand } from './utils/getGetChangesCommand';
import { getBreakingChanges } from './utils/getBreakingChanges';
import { writeFiles } from './utils/writeFiles';
import { Void } from './utils/void';
import * as request from 'request';
import { getPrivateToken } from './utils/get-private-token';
import { getGitLabURL } from './utils/get-gitlab-url';
import { commitFormat } from './utils/commit-format';

const run = async (): Promise<{ currentCommit: string; lastPublishedVersion: string; changes: CommitInterface[] }> => {
  appendFixOrFeatFlags();

  let currentCommit: string;
  let latestPublishedTag: string;

  try {
    currentCommit = await getCurrentCommitWith('git rev-parse HEAD');
  } catch (e) {
    Messenger.error('Could not get current commit')
      .info(Iro.bold('Error message:'))
      .write(e);
    process.exit(1);
  }

  try {
    latestPublishedTag = await getLatestPublishedTagWith('git describe --tags `git rev-list --tags --max-count=1`');
  } catch (e) {
    Messenger.warning(`Could not get latest published tag - falling back to initial version`);
  }

  const getChangesCommand = await Either.fromNullable(latestPublishedTag).fold(
    () => `git rev-list --all --no-merges --format='${commitFormat}'`,
    getGetChangesCommand
  );

  const changes = await getChangesWith(getChangesCommand);

  return Task.of((currentCommit) => (lastPublishedVersion) => (changes) => ({
    currentCommit,
    lastPublishedVersion,
    changes,
  }))
    .ap(Task.of(currentCommit))
    .ap(Task.of(latestPublishedTag))
    .ap(Task.of(changes))
    .fork(console.error, (x) => x)[1];
};

run().then(({ currentCommit, lastPublishedVersion, changes }) => {
  const versionChanger = changeVersion(lastPublishedVersion);

  Messenger.info('Evaluating version bumping requirements...');

  const newVersion = Either.of(versionChanger(getAmendMajor(changes), getAmendMinor(changes), getAmendPatch(changes)))
    .map(addVersionPrefix)
    .map(addVersionPostfix)
    .fold(Void[0], R.identity);

  if (lastPublishedVersion === newVersion) {
    Messenger.warning('Given changes do not require releasing');
    return;
  }

  Messenger.info(`New release version is going to be ${Iro.green(Iro.bold(newVersion))}`);

  Messenger.info('Building changelog...');

  const changelog: string = `# ${newVersion}`.concat(getChangelog(changes)).concat(getBreakingChanges(changes));

  Messenger.info('Changelog successfully built');

  writeFiles({ currentCommit, lastPublishedVersion, changes, newVersion, changelog });

  const privateToken = getPrivateToken();
  const gitLab = getGitLabURL();
  request.post(
    `${gitLab}/projects/${process.env.CI_PROJECT_ID}/repository/tags`,
    {
      headers: {
        'PRIVATE-TOKEN': privateToken,
      },
      json: true,
      body: {
        id: process.env.CI_PROJECT_ID,
        tag_name: newVersion,
        ref: currentCommit,
        release_description: changelog,
      },
    },
    (e: Error, r, b) => {
      if (e) {
        Messenger.error(e.message);
        return;
      }

      if (b.message && /already exists/.test(b.message)) {
        Messenger.error(b.message);
        return;
      }

      if (b.message && /404/.test(b.message)) {
        Messenger.error('@priestine/semantics is not running in CI. Terminating.');
        return;
      }

      Messenger.success(`Version ${Iro.bold(Iro.green(newVersion))}${Iro.white(' successfully released! 🙌')}`);
    }
  );
});
