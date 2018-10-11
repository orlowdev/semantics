import { ExecException, exec } from 'child_process';

/**
 * Execute command in a Promise.
 * @param cmd Command to be executed.
 */
export const execPromise = (cmd: string): Promise<string | ExecException> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (e: ExecException, stdout: string, stderr: string) => {
      if (e) reject(e);
      if (stderr) reject(stderr.replace(/\n$/, ''));
      resolve(stdout.replace(/\n$/, ''));
    });
  });
};
