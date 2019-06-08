import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { writeFileSync } from 'fs';
import { Log } from '../utils/log.util';

export function writeTemporaryFilesIfRequired({ intermediate }: SemanticsCtx) {
  if (!intermediate.writeTemporaryFiles) {
    return intermediate;
  }

  const writeFile = (path, content) => writeFileSync(path, content, 'utf8');

  Log.info('Writing to temporary files...');

  try {
    writeFile('.tmp.current_tag_data', intermediate.latestVersionTag || '');
    writeFile('.tmp.current_commit_data', intermediate.currentCommitHash);
    writeFile('.tmp.current_changes.json', JSON.stringify(intermediate.commitsSinceLatestVersion, null, 2));
    writeFile('.tmp.version_data', intermediate.newVersion);
    writeFile('.tmp.changelog.md', intermediate.tagMessageContents);

    Log.success('Temporary files successfully created');
  } catch (e) {
    Log.error(`Could not write temporary files: ${e.message}`);
  }

  return intermediate;
}
