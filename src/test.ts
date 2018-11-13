import { Either, EitherInterface, Middleware, Pipeline, Task } from '@priestine/data/src';
import { execPromise } from './utils/exec-promise';
import { Shell } from '@totemish/shell';
import * as R from 'ramda';
import { commitFormat } from './utils/commit-format';
import { reverseCommitOrder } from './utils/reverse-commit-order';
import { normalizeChanges } from './utils/normalize-changes';
import { normalizeBody } from './utils/normalize-body';
import { extractCommitTypes } from './utils/extract-commit-types';
import { extractBreakingChanges } from './utils/extract-breaking-changes';
import { changeVersion } from './utils/change-version';
import { getSubjects } from './utils/get-subjects';
import { getAmendMajor } from './utils/get-amend-major';
import { getAmendMinor } from './utils/get-amend-minor';
import { getAmendPatch } from './utils/get-amend-patch';
import { addVersionPrefix } from './utils/add-version-prefix';
import { addVersionPostfix } from './utils/add-version-postfix';
import { flatten } from './utils/flatten-array';
import { CommitInterface } from './interfaces/commit.interface';
import { buildChangelog } from './utils/build-changelog';
import { writeFileSync } from 'fs';

const lift = Middleware.of;
const Void: [(x) => void, (x) => void] = [() => {}, () => {}];

/**
 * Console message output.
 * @param message
 */
const infoMessage = (message) => Shell.write(Shell.blue('SEMANTICS INFO '), Shell.white(message));
const successMessage = (message) => Shell.write(Shell.green('SEMANTICS SUCCESS '), Shell.white(message));
const warningMessage = (message) => Shell.write(Shell.yellow('SEMANTICS WARNING '), Shell.white(message));
const errorMessage = (message) => Shell.write(Shell.red('SEMANTICS ERROR '), Shell.white(message));

const run = async () => {
  const result = Task.of((currentCommit) => (lastPublishedVersion) => (changes) => ({
    currentCommit,
    lastPublishedVersion,
    changes,
  }));

  const currentCommit = Pipeline.from([
    R.tap(() => infoMessage('Extracting current commit hash...')),
    execPromise,
    Either.fromNullable,
    (y: EitherInterface<string>) =>
      y.fold(
        R.tap(() => warningMessage('Could not extract current commit')),
        R.tap((x) => successMessage(`Found latest tag commit hash: ${Shell.green(Shell.bold(x))}`))
      ),
  ]);

  const latestPublishedTag = await Pipeline.from([
    R.tap(() => infoMessage('Extracting latest tagged version...')),
    execPromise,
    Either.fromNullable,
    (y: EitherInterface<string>) =>
      y.fold(
        R.tap(() => warningMessage('No tags found, falling back to initial version')),
        R.tap((x) => successMessage(`Found current tagged version: ${Shell.green(Shell.bold(x))}`))
      ),
  ]).process('git describe --tags `git rev-list --tags --max-count=1`');

  const getLatestPublishedCommit = Pipeline.from([
    R.tap(() => infoMessage(' Receiving commit hash of latest tagged version...')),
    execPromise,
    Either.fromNullable,
    (y: EitherInterface<string>) =>
      y.fold(
        R.tap(() => errorMessage('Could not extract commit of the latest tagged version')),
        R.tap((x) => successMessage(`Found commit related to currently tagged version: ${Shell.green(Shell.bold(x))}`))
      ),
  ]);

  const latestPublishedCommit = await Either.fromNullable(latestPublishedTag).fold(
    R.tap(() => warningMessage('No tags found, falling back to initial version')),
    (x) => getLatestPublishedCommit.process(`git show-ref ${x} -s`)
  );

  const getChangesCommand = Either.fromNullable(latestPublishedCommit).fold(
    () => `git rev-list --all --no-merges --format='${commitFormat}'`,
    (x) => `git rev-list ${x}..HEAD --no-merges --format='${commitFormat}'`
  );

  const changes = await Pipeline.from([
    R.tap(() => infoMessage('Collecting list of changes...')),
    execPromise,
    Either.fromNullable,
    (y: EitherInterface<string>) =>
      y.fold(R.tap(() => errorMessage('Could not find any changes since last commit')), (x) =>
        reverseCommitOrder(JSON.parse(normalizeChanges(x)))
          .map(normalizeBody)
          .map(extractCommitTypes)
          .map(extractBreakingChanges)
      ),
  ]).process(getChangesCommand);

  return result
    .ap(Task.of(await currentCommit.process('git rev-parse HEAD')))
    .ap(Task.of(latestPublishedTag))
    .ap(Task.of(changes))
    .fork(console.error, (x) => x)[1];
};

run().then(({ currentCommit, lastPublishedVersion, changes }) => {
  const versionChanger = changeVersion(lastPublishedVersion);

  const getCommitSubjects = getSubjects(changes);

  Shell.write(Shell.blue(`SEMANTICS INFO`), Shell.white(' Evaluating version bumping requirements'));

  const amendMajor = getAmendMajor(changes);
  const amendMinor = getAmendMinor(changes);
  const amendPatch = getAmendPatch(changes);
  const newVersion = [versionChanger(amendMajor, amendMinor, amendPatch)]
    .map(addVersionPrefix)
    .map(addVersionPostfix)[0];

  if (lastPublishedVersion === newVersion) {
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
    changes.map((x: CommitInterface) =>
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

  writeFileSync('.tmp.current_tag_data', lastPublishedVersion, 'utf8');
  writeFileSync('.tmp.current_commit_data', currentCommit, 'utf8');
  writeFileSync('.tmp.current_changes.json', JSON.stringify(changes, null, 2), 'utf8');
  writeFileSync('.tmp.version_data', newVersion, 'utf8');
  writeFileSync('.tmp.changelog.md', changeLog, 'utf8');

  Shell.write(
    Shell.green('SEMANTICS SUCCESS'),
    Shell.white(' 🙌  Version ', Shell.bold(Shell.green(newVersion)), ' successfully released!')
  );
});
