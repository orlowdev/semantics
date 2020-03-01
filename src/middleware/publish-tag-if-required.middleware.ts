import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';
import { execPromise } from '../utils/exec-promise.util';
import { execSync } from 'child_process';

export function publishTagIfRequired({ intermediate }: SemanticsCtx) {
  if (!intermediate.publishTag) {
    Log.info('Skipping publishing newly created tag...');

    return intermediate;
  }

  const gitUser = intermediate.gitUserName ? intermediate.gitUserName : intermediate.user;

  execSync(`git config user.name ${gitUser}`);

  if (intermediate.gitUserEmail) {
    execSync(`git config user.email ${intermediate.gitUserEmail}`);
  }

  const origin = intermediate.origin
    ? intermediate.origin
    : execSync('git config --get remote.origin.url', { encoding: 'utf8' });

  let branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' });
  if (/HEAD/.test('HEAD')) {
    branch = execSync('git name-rev HEAD', { encoding: 'utf8' }).replace(/HEAD\s+/, '');
    Log.info(`The HEAD is detached. Current branch is ${branch}`);
  }

  if (!origin.includes('@')) {
    if (!intermediate.password) {
      Log.error('Private token not specified');
      process.exit(1);
    }

    const accessibleRemote = origin.replace('https://', `https://${intermediate.user}:${intermediate.password}@`);
    Log.info("Setting new remote origin...");
    execSync(`git remote set-url origin ${accessibleRemote}`);
  }

  execPromise(`git tag -am "${intermediate.tagMessageContents}" ${intermediate.newVersion}`)
    .then(() => {
      // if (intermediate.writeToChangelog) {
      //   if (!existsSync('./CHANGELOG.md')) {
      //     Log.warning('CHANGELOG.md is not in place. Creating the file.');
      //     writeFileSync('./CHANGELOG.md', '', 'utf8');
      //   }
      //
      //   const changelog = readFileSync('./CHANGELOG.md', 'utf8');
      //   writeFileSync('./CHANGELOG.md', intermediate.tagMessageContents.concat('\n').concat(changelog));
      //   execSync('git add ./CHANGELOG.md');
      //   execSync(`git commit -m "docs(changelog): add ${intermediate.newVersion} changes"`);
      // }

      return execPromise(`git push origin ${branch} --follow-tags`);
    })
    .catch(Log.error)
    .then(() => Log.success(`Version ${Iro.bold(Iro.green(intermediate.newVersion))} successfully released! 🙌`))
    .catch(Log.error);
}
