import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { execPromise } from '../utils/exec-promise.util';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';

export function getLatestVersionTag({ intermediate }: SemanticsCtx) {
  const glob = '*[0-9]';
  const matcher = intermediate.preciseVersionMatching ? `${intermediate.prefix}${glob}${intermediate.postfix}` : glob;

  return execPromise(`git describe --match "${matcher}" --abbrev=0 HEAD --tags`)
    .then((latestVersionTag) => {
      Log.success(`Latest version tag: ${Iro.green(latestVersionTag)}`);

      return {
        ...intermediate,
        latestVersionTag,
      };
    })
    .catch((e) => {
      if (!/\nfatal: No names found, cannot describe anything/.test(e)) {
        Log.error(e.replace('\n', '->'));
        process.exit(1);
      }

      Log.warning(
        `There are no previous tags matching the "${Iro.yellow(
          `${intermediate.prefix}*${intermediate.postfix}`
        )}" pattern.`
      );
      Log.warning(`Initial commit hash will be considered the latest version.`);

      return {
        ...intermediate,
        latestVersionTag: undefined,
      };
    });
}
