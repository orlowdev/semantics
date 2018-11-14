import { CommitInterface } from '../interfaces/commit.interface';
import { flatten } from './flatten-array';

export const getBreakingChanges = (changes: CommitInterface[]): string => {
  let substring: string = '';

  if (!process.argv.includes('--no-bc')) {
    const bc = flatten(
      changes.map((x: CommitInterface) =>
        x.breakingChanges.map(
          (y: string) => `**${x.abbrevHash}**: ${y}${x.issueReference ? ` (**${x.issueReference}**)` : ''}`
        )
      )
    );

    if (bc && bc.length) {
      substring += `\n\n## BREAKING CHANGES\n`;

      if (!process.argv.includes('--no-helpers')) {
        substring += '\n`' + 'All things backwards-incompatible' + '`\n';
      }

      substring += bc.join('\n');
    }
  }

  return substring;
};
