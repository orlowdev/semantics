import { CommitTypes } from '../types/commit-types';
import { ICommitType } from '../interfaces/commit-type.interface';
import { Messenger } from './Messenger';
import { Shell } from '@totemish/shell';
import { getSubjects } from './get-subjects';
import { CommitInterface } from '../interfaces/commit.interface';

export const getChangelog = (changes: CommitInterface[]): string => {
  const getSubjectedCommits = getSubjects(changes);

  return CommitTypes.map((ct: ICommitType) => {
    let substring: string = '';

    if (process.argv.includes(`--no-${ct.type}`)) {
      ct.display = false;
    }

    if (!ct.display) {
      Messenger.info(`Skipping ${Shell.yellow(Shell.bold(ct.type))} commits as they were explicitly disabled...`);
      return substring;
    }

    const subjects = getSubjectedCommits(ct.type);

    if (subjects && subjects.length) {
      substring += `\n\n## ${ct.title}\n`;

      if (!process.argv.includes('--no-helpers')) {
        substring += '\n`' + ct.description + '`\n';
      }

      substring += '\n';
      substring += getSubjectedCommits(ct.type)
        .map((x: string) => `* ${x}`)
        .join('\n');
    }

    return substring;
  }).join('');
};
