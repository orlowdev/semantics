import { CommitInterface } from '../interfaces/commit.interface';

export const normalizeBody = (commit: CommitInterface) => {
  commit.body = (commit.body as any)
    .split(', ')
    .reduce((r: string[], x: string) => (x ? r.concat([/^\*\s+/.test(x) ? x.replace(/^\*\s+/, '') : x]) : r), []);
  return commit;
};
