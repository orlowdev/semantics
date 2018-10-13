import { CommitInterface } from '../interfaces/commit.interface';
import { CommitTypes } from '../types/commit-types';

/**
 * Extract commit subjects and transform them into readable form.
 * @param xs CommitInterface[]
 * @returns string[]
 */
export const getSubjects = (xs: CommitInterface[]) => (type: keyof typeof CommitTypes): string[] =>
  xs
    .filter((x: CommitInterface) => x.type === type)
    .map(
      (x: CommitInterface) =>
        `**${x.abbrevHash}**: ${x.subject}${x.issueReference ? ` (${x.issueReference})` : ''}${
          x.body.length ? `\n\n> ${x.body.join('\n> ')}\n` : ''
        }`
    );
