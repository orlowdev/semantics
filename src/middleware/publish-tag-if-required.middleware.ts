import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { Iro } from '@priestine/iro/src';
import * as request from 'request';

export function publishTagIfRequired({ intermediate }: SemanticsCtx) {
  if (!intermediate.publishTag) {
    Log.info('Skipping publishing newly created tag...');

    return intermediate;
  }

  if (!intermediate.privateToken) {
    Log.error('Private token not specified');
    process.exit(1);
  }

  if (!intermediate.projectPath) {
    Log.error('Project path not provided');
    process.exit(1);
  }

  if (intermediate.repository === 'gitlab') {
    request.post(
      `https://gitlab.com/api/v4/projects/${intermediate.projectPath}/repository/tags`,
      {
        headers: {
          'PRIVATE-TOKEN': intermediate.privateToken,
        },
        json: true,
        body: {
          id: intermediate.projectPath.replace(/\\/g, '%2F'),
          tag_name: intermediate.newVersion,
          ref: intermediate.currentCommitHash,
          release_description: intermediate.tagMessageContents,
        },
      },
      (e: Error, r, b) => {
        if (e) {
          Log.error(e.message);
          return;
        }

        if (b.error) {
          Log.error(`Server responded with error: ${Iro.red(b.error)}`);
          return;
        }

        Log.success(`Version ${Iro.bold(Iro.green(intermediate.newVersion))} successfully released! 🙌`);
      }
    );
  } else {
    request.post(
      `https://api.github.com/repos/${intermediate.projectPath}/releases`,
      {
        headers: {
          Authorization: `token ${intermediate.privateToken}`,
          'User-Agent': 'Priestine-Semantics',
        },
        json: true,
        body: {
          tag_name: intermediate.newVersion,
          name: intermediate.newVersion,
          body: intermediate.tagMessageContents,
        },
      },
      (e: Error, r, b) => {
        if (e) {
          Log.error(e.message);
          return;
        }

        if (r.statusCode !== 201) {
          Log.error(`Server responded with error: ${Iro.red(b.message)}`);
          return;
        }

        Log.success(`Version ${Iro.bold(Iro.green(intermediate.newVersion))} successfully released! 🙌`);
      }
    );
  }
}
