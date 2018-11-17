/**
 * Append args to `process.argv` to only put fixes and features to changelog if `--fix-or-feat` flag is provided.
 */
import { Messenger } from './Messenger';
import { Iro } from '@priestine/iro';

export const appendFixOrFeatFlags = (): void => {
  if (!process.argv.includes('--fix-or-feat')) {
    return;
  }

  Messenger.info(
    Iro.bold(
      'You have provided the ',
      Iro.green(Iro.underline('--fix-or-feat')),
      Iro.white(' flag. Only '),
      Iro.blue('fixes'),
      Iro.white(', '),
      Iro.blue('features'),
      Iro.white(' and '),
      Iro.blue('breaking changes'),
      Iro.white(' will be displayed in the changelog.')
    )
  );

  process.argv.push('--no-chore');
  process.argv.push('--no-style');
  process.argv.push('--no-refactor');
  process.argv.push('--no-docs');
  process.argv.push('--no-perf');
  process.argv.push('--no-test');
  process.argv.push('--no-revert');
  process.argv.push('--no-build');
  process.argv.push('--no-ci');
  process.argv.push('--no-helpers');
};
