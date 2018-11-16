import { writeFileSync } from 'fs';
import { Messenger } from './Messenger';
import { Either } from '@priestine/data/src';
import { Shell } from '@totemish/shell';
import * as R from 'ramda';
import { Void } from './void';

export const writeFiles = (data: any): void => {
  const writeFile = (path, content) => writeFileSync(path, content, 'utf8');

  Either.of(data)
    .map(Messenger.tapInfo('Writing to temporary files...'))
    .chain((x: any) => Either.try(() => writeFile('.tmp.current_tag_data', x.lastPublishedVersion)))
    .chain((x: any) => Either.try(() => writeFile('.tmp.current_commit_data', x.currentCommit)))
    .chain((x: any) => Either.try(() => writeFile('.tmp.current_changes.json', JSON.stringify(x.changes, null, 2))))
    .chain((x: any) => Either.try(() => writeFile('.tmp.version_data', x.newVersion)))
    .chain((x: any) => Either.try(() => writeFile('.tmp.changelog.md', x.changelog)))
    .map(Messenger.tapInfo('Temporary files successfully created') as any)
    .map(R.tap(Shell.blank) as any)
    .fold(...Void);

  Messenger.info('Temporary files successfully created');
};
