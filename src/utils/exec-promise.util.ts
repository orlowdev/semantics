import { exec, ExecException } from "child_process";

/**
 * Execute command in a Promise.
 * @param cmd Command to be executed.
 * @returns Promise<string>
 */
export function execPromise(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (e: ExecException, stdout: string, stderr: string) => {
      if (e) return reject(e.message.replace(/\n$/, ""));
      if (stderr) return reject(stderr.replace(/\n$/, ""));
      resolve(stdout.replace(/\n$/, ""));
    });
  });
}
