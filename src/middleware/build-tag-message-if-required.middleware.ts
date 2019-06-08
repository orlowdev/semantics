import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { CommitInterface } from '../interfaces/commit.interface';
import { Iro } from '@priestine/iro/src';
import { CommitTypeInterface } from '../interfaces/commit-type.interface';
import { getSubjects } from './transform-commits-string-to-objects.middleware';
import * as R from 'ramda';

export const getBreakingChanges = (changes: CommitInterface[]): string => {
  let substring: string = '';

  const bc = R.flatten(
    changes.map((x: CommitInterface) =>
      x.breakingChanges.map((y: string) => `* ${x.scope ? x.scope : ' '}${y} ${x.abbrevHash}`)
    )
  );

  if (bc && bc.length) {
    Log.success(`Adding ${Iro.green(Iro.bold(`${bc.length} breaking change`))} entries to the changelog`);

    substring += `\n\n## BREAKING CHANGES\n`;

    substring += bc.join('\n');
  }

  return substring;
};

export const getChangelog = (
  changes: CommitInterface[],
  types: CommitTypeInterface[],
  omittedTypes: string[]
): string => {
  const getSubjectedCommits = getSubjects(changes);

  omittedTypes.forEach((ct: string) => {
    const commitsOfThatType = changes.filter((change) => change.type === ct);

    const mentionedTwiceIndex = types.findIndex((t) => t.type === ct);

    if (~mentionedTwiceIndex) {
      Log.warning(`Commit type ${Iro.bold(Iro.yellow(ct))} was mentioned in both whitelist and blacklist.`);
      Log.warning(`Removing ${Iro.bold(Iro.yellow(ct))} from whitelist as blacklist takes precedence.`);
      Log.warning('Note that given commit type will not bump the version as it is blacklisted.');
      types.splice(mentionedTwiceIndex, 1);
    }

    if (commitsOfThatType.length) {
      Log.info(
        `Skipping ${Iro.cyan(Iro.bold(`${commitsOfThatType.length} ${ct}`))} ${
          commitsOfThatType.length === 1 ? 'commit' : 'commits'
        }`
      );
    }
  });

  return types
    .map((ct: CommitTypeInterface) => {
      let substring: string = '';

      const commitsOfThatType = changes.filter((change) => change.type === ct.type);

      if (commitsOfThatType.length) {
        Log.success(
          `Adding ${Iro.green(Iro.bold(`${commitsOfThatType.length} ${ct.type}`))} ${
            commitsOfThatType.length === 1 ? 'commit' : 'commits'
          } to the changelog`
        );
      }

      const subjects = getSubjectedCommits(ct.type);

      if (subjects && subjects.length) {
        substring += `\n\n## ${ct.title}\n`;

        substring += '\n';
        substring += getSubjectedCommits(ct.type)
          .map((x: string) => `* ${x}`)
          .join('\n');
      }

      return substring;
    })
    .join('');
};

export function buildTagMessageIfRequired({ intermediate }: SemanticsCtx) {
  if (intermediate.tagMessage) {
    Log.info('Building changelog...');

    intermediate.tagMessageContents = `# ${intermediate.newVersion}`
      .concat(
        getChangelog(
          intermediate.commitsSinceLatestVersion as CommitInterface[],
          intermediate.commitTypesIncludedInTagMessage,
          intermediate.commitTypesExcludedFromTagMessage
        )
      )
      .concat(getBreakingChanges(intermediate.commitsSinceLatestVersion as CommitInterface[]));
  }

  return intermediate;
}
