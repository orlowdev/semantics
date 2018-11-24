import { writeFileSync } from 'fs';
import { Messenger } from './Messenger';
import { Either } from '@priestine/data/src';
import { Iro } from '@priestine/iro';
import * as R from 'ramda';
import { Void } from './void';

export const writeFiles = (data: any): void => {
  const writeFile = (path, content) => writeFileSync(path, content, 'utf8');

  Messenger.info('Writing to temporary files...');

  Either.try(() => writeFile('.tmp.current_tag_data', data.lastPublishedVersion));
  Either.try(() => writeFile('.tmp.current_commit_data', data.currentCommit));
  Either.try(() => writeFile('.tmp.current_changes.json', JSON.stringify(data.changes, null, 2)));
  Either.try(() => writeFile('.tmp.version_data', data.newVersion));
  Either.try(() => writeFile('.tmp.changelog.md', data.changelog)).fold(
    () => Messenger.error('Could not write temporary files'),
    () => Messenger.info('Temporary files successfully created')
  );
};
