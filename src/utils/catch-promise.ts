import { ExecException } from 'child_process';
import { Shell } from '@totemish/shell';

export const catchError = (e: string | ExecException): void => {
  Shell.error(e.toString());
};
