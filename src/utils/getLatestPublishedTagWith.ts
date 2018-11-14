import { ExecMiddleware } from './ExecMiddleware';
import { Messenger } from './Messenger';
import { Either, EitherInterface } from '@priestine/data/src';
import * as R from 'ramda';
import { Shell } from '@totemish/shell';

export const getLatestPublishedTagWith = (cmd: string): Promise<string> =>
  ExecMiddleware.map(Messenger.tapInfo('Getting latest tagged version...'))
    .map(Either.fromNullable)
    .map((y: EitherInterface<string>) =>
      y.fold(() => {
        Messenger.warning('No tags found, falling back to initial version');
        return '0.0.0';
      }, R.tap((x) => Messenger.success(`Got latest tagged version: ${Shell.green(Shell.bold(x))}`)))
    )
    .process(cmd);
