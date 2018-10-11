import { exec, ExecException } from 'child_process';
import { Shell } from '@totemish/shell';

exec('echo hello', (e: ExecException, stdout: string, stderr: string) => {
  Shell.write(Shell.green(stdout));
});
