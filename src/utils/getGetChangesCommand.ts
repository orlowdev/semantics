import { Either, Middleware } from '@priestine/data/src';
import { Messenger } from './Messenger';
import { getLatestPublishedCommitWith } from './getLatestPublishedCommitWith';
import { commitFormat } from './commit-format';

export const getGetChangesCommand = (tag: string): Promise<string> =>
  Middleware.of((x: string) => x)
    .map(Either.fromNullable)
    .map((lpt) =>
      lpt.fold(Messenger.tapWarning('No tags found, falling back to initial version'), (x) =>
        getLatestPublishedCommitWith(`git show-ref ${x} -s`)
      )
    )
    .map(Either.fromNullable)
    .map((lpc) =>
      lpc.fold(
        () => `git rev-list --all --no-merges --format='${commitFormat}'`,
        (x) => `git rev-list ${x}..HEAD --no-merges --format='${commitFormat}'`
      )
    )
    .process(tag);
