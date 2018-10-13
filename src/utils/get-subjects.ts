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
        `[${x.abbrevHash}](https://gitlab.com/${process.env.CI_PROJECT_PATH_SLUG}/commit/${x.hash}): ${x.subject}`
    );
