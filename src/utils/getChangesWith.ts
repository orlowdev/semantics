import { Either, EitherInterface } from '@priestine/data/src';
import { reverseCommitOrder } from './reverse-commit-order';
import { normalizeChanges } from './normalize-changes';
import { normalizeBody } from './normalize-body';
import { extractCommitTypes } from './extract-commit-types';
import { extractBreakingChanges } from './extract-breaking-changes';
import { Messenger } from './Messenger';
import { ExecMiddleware } from './ExecMiddleware';
import { Shell } from '@totemish/shell';

export const getChangesWith = (cmd: string) =>
  ExecMiddleware.map(Messenger.tapInfo('Getting list of changes...'))
    .map(Either.fromNullable)
    .map((y: EitherInterface<string>) =>
      y.fold(Messenger.tapError('Could not find any changes since last commit'), (x: string) => {
        const changes = reverseCommitOrder(JSON.parse(normalizeChanges(x)))
          .map(normalizeBody)
          .map(extractCommitTypes)
          .map(extractBreakingChanges);

        Messenger.success(`Got ${Shell.bold(Shell.green(changes.length.toString()))} changes:`);
        changes.map(({ abbrevHash, type, subject }) =>
          Messenger.success(` > ${Shell.underline(abbrevHash)} ${Shell.white(Shell.bold(type), ': ', subject)}`)
        );

        return changes;
      })
    )
    .process(cmd);
