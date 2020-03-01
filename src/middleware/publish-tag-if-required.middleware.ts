import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';
import { execPromise } from '../utils/exec-promise.util';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

export function publishTagIfRequired({ intermediate }: SemanticsCtx) {
  if (!intermediate.publishTag) {
    Log.info('Skipping publishing newly created tag...');

    return intermediate;
  }

  const origin = execSync('git config --get remote.origin.url', { encoding: 'utf8' });
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' });


  if (!origin.includes('@')) {
    if (!intermediate.password) {
      Log.error('Private token not specified');
      process.exit(1);
    }

    const accessibleRemote = origin.replace('https://', `https://${intermediate.user}:${intermediate.password}@`);

    execSync(`git remote set-url origin ${accessibleRemote}`);
  }

  if (intermediate.writeToChangelog) {
    if (!existsSync('./CHANGELOG.md')) {
      Log.warning('CHANGELOG.md is not in place. Creating the file.');
      writeFileSync('./CHANGELOG.md', '', 'ut8');
    }

    const changelog = readFileSync('./CHANGELOG.md', 'utf8');
    writeFileSync('./CHANGELOG.md', intermediate.tagMessageContents.concat('\n').concat(changelog));
    execSync('git add ./CHANGELOG.md');
    execSync(`git commit -m "docs(changelog): add ${intermediate.newVersion} changes"`);
    execSync(`git push origin ${branch}`);
  }

  execPromise(`git tag -am "${intermediate.tagMessageContents}" ${intermediate.newVersion}`)
    .then(() => execPromise(`git push origin ${intermediate.newVersion}`))
    .catch(Log.error);
}
