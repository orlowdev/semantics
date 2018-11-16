import { Middleware } from '@priestine/data/src';
import { getLatestPublishedCommitWith } from './getLatestPublishedCommitWith';
import { commitFormat } from './commit-format';

export const getGetChangesCommand = (tag: string): Promise<string> =>
  Middleware.of((x: string) => x)
    .map((x) => getLatestPublishedCommitWith(`git show-ref ${x} -s`))
    .map((x) => `git rev-list ${x}..HEAD --no-merges --format='${commitFormat}'`)
    .process(tag);
