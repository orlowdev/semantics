import { Shell } from '@totemish/shell';
import { execPromise } from './utils/exec-promise';
import { catchError } from './utils/catch-promise';

execPromise('git rev-parse HEAD')
  .then((commit: string) => {
    execPromise('git rev-parse --abbrev-ref HEAD')
      .then((branch: string) => {
        Shell.success(branch, commit);
      })
      .catch(catchError);
  })
  .catch(catchError);
