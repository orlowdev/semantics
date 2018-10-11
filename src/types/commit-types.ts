export abstract class CommitTypes {
  public static feat = { description: 'A new feature', title: 'Features' };
  public static fix = { description: 'A bug fix', title: 'Bug Fixes' };
  public static docs = { description: 'Documentation only changes', title: 'Documentation' };
  public static style = {
    description:
      'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    title: 'Styles',
  };
  public static refactor = {
    description: 'A code change that neither fixes a bug nor adds a feature',
    title: 'Code Refactoring',
  };
  public static perf = { description: 'A code change that improves performance', title: 'Performance Improvements' };
  public static test = { description: 'Adding missing tests or correcting existing tests', title: 'Tests' };
  public static build = {
    description: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    title: 'Builds',
  };
  public static ci = {
    description:
      'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
    title: 'Continuous Integrations',
  };
  public static chore = { description: `Other changes that don't modify src or test files`, title: 'Chores' };
  public static revert = { description: 'Reverts a previous commit', title: 'Reverts' };
}
