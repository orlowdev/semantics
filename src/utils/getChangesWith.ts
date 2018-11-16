import { Either, EitherInterface } from '@priestine/data/src';
import { reverseCommitOrder } from './reverse-commit-order';
import { normalizeChanges } from './normalize-changes';
import { normalizeBody } from './normalize-body';
import { extractCommitTypes } from './extract-commit-types';
import { extractBreakingChanges } from './extract-breaking-changes';
import { Messenger } from './Messenger';
import { ExecMiddleware } from './ExecMiddleware';
import { Iro } from '@priestine/iro';

export const getChangesWith = (cmd: string) =>
  ExecMiddleware.map(Messenger.tapInfo('Getting list of changes...'))
    .map(Either.fromNullable)
    .map((y: EitherInterface<string>) =>
      y.fold(
        () => {
          Messenger.error('Could not find any changes since last release');
          process.exit(1);
        },
        (x: string) => {
          if (x === cmd) {
            Messenger.error('Could not find any changes since last release');
            process.exit(1);
          }

          const changes = reverseCommitOrder(JSON.parse(normalizeChanges(x)))
            .map(normalizeBody)
            .map(extractCommitTypes)
            .map(extractBreakingChanges);

          Messenger.info(`Got ${Iro.bold(Iro.green(changes.length.toString()))} changes:`);
          changes.map(({ abbrevHash, type, subject }) =>
            Messenger.info(`  > ${Iro.underline(abbrevHash)} ${Iro.white(Iro.bold(type), ': ', subject)}`)
          );

          return changes;
        }
      )
    )
    .process(cmd);
