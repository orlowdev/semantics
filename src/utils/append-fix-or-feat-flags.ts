export const appendFixOrFeatFlags = (): void => {
  if (!process.argv.includes('--fix-or-feat')) {
    return;
  }

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
