#!/usr/bin/env node

import { Shell } from '@totemish/shell';
import { writeFileSync } from 'fs';
import { addVersionPostfix } from './utils/add-version-postfix';
import { addVersionPrefix } from './utils/add-version-prefix';
import { appendFixOrFeatFlags } from './utils/append-fix-or-feat-flags';
import { execPromise } from './utils/exec-promise';
import { buildChangelog } from './utils/build-changelog';
import { catchError } from './utils/catch-promise';
import { commitFormat } from './utils/commit-format';
import { getGitLabURL } from './utils/get-gitlab-url';
import { getPrivateToken } from './utils/get-private-token';
import { normalizeChanges } from './utils/normalize-changes';
import { normalizeBody } from './utils/normalize-body';
import { extractCommitTypes } from './utils/extract-commit-types';
import { extractBreakingChanges } from './utils/extract-breaking-changes';
import { getAmendMajor } from './utils/get-amend-major';
import { getAmendMinor } from './utils/get-amend-minor';
import { getAmendPatch } from './utils/get-amend-patch';
import { changeVersion } from './utils/change-version';
import { getSubjects } from './utils/get-subjects';
import * as request from 'request';
import { CommitInterface } from './interfaces/commit.interface';
import { flatten } from './utils/flatten-array';
import { reverseCommitOrder } from './utils/reverse-commit-order';

appendFixOrFeatFlags();

const run = (currentTag, currentCommit, changes) => {
  Shell.write(Shell.blue(`SEMANTICS INFO`), Shell.white(' Collecting list of changes'));

  const normalizedChanges: CommitInterface[] = reverseCommitOrder(JSON.parse(normalizeChanges(changes)))
    .map(normalizeBody)
    .map(extractCommitTypes)
    .map(extractBreakingChanges)
  ;

  const versionChanger = changeVersion(currentTag);

  const getCommitSubjects = getSubjects(normalizedChanges);

  Shell.write(Shell.blue(`SEMANTICS INFO`), Shell.white(' Evaluating version bumping requirements'));

  const amendMajor = getAmendMajor(normalizedChanges);
  const amendMinor = getAmendMinor(normalizedChanges);
  const amendPatch = getAmendPatch(normalizedChanges);
  const newVersion = [versionChanger(amendMajor, amendMinor, amendPatch)]
    .map(addVersionPrefix)
    .map(addVersionPostfix)[0];

  if (currentTag === newVersion) {
    Shell.write(Shell.yellow(`SEMANTICS WARN`), Shell.white(' Given changes do not require releasing'));
    return;
  }

  const features = getCommitSubjects('feat');
  const fixes = getCommitSubjects('fix');
  const chores = getCommitSubjects('chore');
  const reverts = getCommitSubjects('revert');
  const tests = getCommitSubjects('test');
  const refactors = getCommitSubjects('refactor');
  const perfs = getCommitSubjects('perf');
  const builds = getCommitSubjects('build');
  const docs = getCommitSubjects('docs');
  const styles = getCommitSubjects('style');
  const cis = getCommitSubjects('ci');
  const breakingChanges = flatten(
    normalizedChanges.map((x: CommitInterface) =>
      x.breakingChanges.map(
        (y: string) => `**${x.abbrevHash}**: ${y}${x.issueReference ? ` (**${x.issueReference}**)` : ''}`
      )
    )
  );
  const changeLog = buildChangelog(
    newVersion,
    features,
    fixes,
    chores,
    reverts,
    tests,
    refactors,
    perfs,
    builds,
    cis,
    docs,
    styles,
    breakingChanges
  );

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
        release_description: changeLog,
      },
    },
    (e: Error, r, b) => {
      if (e) {
        Shell.error(`SEMANTICS ERROR ${e.message}`);
        return;
      }

      if (b.message && /already exists/.test(b.message)) {
        Shell.error(`SEMANTICS ERROR ${b.message}`);
        return;
      }

      writeFileSync('.tmp.current_tag_data', currentTag, 'utf8');
      writeFileSync('.tmp.current_commit_data', currentCommit, 'utf8');
      writeFileSync('.tmp.current_changes.json', JSON.stringify(normalizedChanges, null, 2), 'utf8');
      writeFileSync('.tmp.version_data', newVersion, 'utf8');
      writeFileSync('.tmp.changelog.md', changeLog, 'utf8');

      Shell.write(
        Shell.green('SEMANTICS SUCCESS'),
        Shell.white('🙌   Version ', Shell.bold(Shell.green(newVersion)), ' successfully released!')
      );
    }
  );
};

execPromise('git rev-parse HEAD')
  .then((currentCommit: string) => {
    Shell.write(Shell.blue(`SEMANTICS INFO`), Shell.white(' Getting latest tag'));

    execPromise('git describe --tags `git rev-list --tags --max-count=1`')
      .then((currentTag: string) => {
        Shell.write(
          Shell.blue(`SEMANTICS INFO`),
          Shell.white(` Current tag version is `, Shell.bold(Shell.green(currentTag)))
        );

        execPromise(`git show-ref ${currentTag} -s`)
          .then((latestTaggedCommit: string) => {
            Shell.write(Shell.blue(`SEMANTICS INFO`), Shell.white(' Receiving commit bound with current tag'));

            execPromise(`git rev-list ${latestTaggedCommit}..HEAD --no-merges --format='${commitFormat}'`)
              .then((changes: string) => run(currentTag, currentCommit, changes))
              .catch(catchError);
          })
          .catch(() => {
            execPromise(`git rev-list --all --no-merges --format='${commitFormat}'`)
              .then((changes: string) => run(currentTag, currentCommit, changes))
              .catch(catchError);
          });
      })
      .catch(() => {
        Shell.write(Shell.blue(`SEMANTICS INFO`), Shell.white(' No tags found. Preparing initial tag'));

        execPromise(`git rev-list --all --no-merges --format='${commitFormat}'`)
          .then((changes: string) => run('0.0.0', currentCommit, changes))
          .catch(catchError);
      });
  })
  .catch(catchError);
