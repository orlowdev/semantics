import { Shell } from '@totemish/shell';
import { execPromise } from './utils/exec-promise';
import { buildChangelog } from './utils/build-changelog';
import { catchError } from './utils/catch-promise';
import { commitFormat } from './utils/commit-format';
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

execPromise('git rev-parse HEAD')
  .then((currentCommit: string) => {
    execPromise('git describe --tags `git rev-list --tags --max-count=1`')
      .then((currentTag: string) => {
        const versionChanger = changeVersion(currentTag);

        execPromise(`git show-ref ${currentTag} -s`)
          .then((latestTaggedCommit: string) => {
            execPromise(`git rev-list ${latestTaggedCommit}..HEAD --no-merges --format='${commitFormat}'`)
              .then((changes: string) => {
                const normalizedChanges: CommitInterface[] = JSON.parse(normalizeChanges(changes))
                  .map(normalizeBody)
                  .map(extractCommitTypes)
                  .map(extractBreakingChanges);

                const getCommitSubjects = getSubjects(normalizedChanges);
                const amendMajor = getAmendMajor(normalizedChanges);
                const amendMinor = getAmendMinor(normalizedChanges);
                const amendPatch = getAmendPatch(normalizedChanges);
                const newVersion = versionChanger(amendMajor, amendMinor, amendPatch);

                if (currentTag === `${newVersion[0]}.${newVersion[1]}.${newVersion[2]}`) {
                  Shell.info('Given changes do not require releasing.');
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
                      (y: string) => `**${x.abbrevHash}**${x.issueReference ? ` (${x.issueReference})` : ''}: ${y}`
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

                request.post(
                  `https://gitlab.com/api/v4/projects/${process.env.CI_PROJECT_ID}/repository/tags`,
                  {
                    headers: {
                      'PRIVATE-TOKEN': process.env.PRIVATE_TOKEN,
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
                    if (e) Shell.error(e.message);
                    Shell.success(`Successfully released ${newVersion}`);
                  }
                );
              })
              .catch(catchError);
          })
          .catch(catchError);
      })
      .catch(catchError);
  })
  .catch(catchError);
