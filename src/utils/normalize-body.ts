import { CommitInterface } from '../interfaces/commit.interface';

/**
 * Transform non-normalized commit body string into array of strings.
 * If body string contains an asterisk (*), it will be automatically trimmed.
 * @param commit CommitInterface
 * @returns CommitInterface
 */
export const normalizeBody = (commit: CommitInterface): CommitInterface => {
  commit.body = (commit.body as any)
    .split(', ')
    .reduce((r: string[], x: string) => (x ? r.concat([/^\*\s+/.test(x) ? x.replace(/^\*\s+/, '') : x]) : r), []);
  return commit;
};
