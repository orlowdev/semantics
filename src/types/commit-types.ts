/**
 * Commit type descriptor based on Conventional Changelog.
 * @class CommitTypes
 * @abstract
 */
export abstract class CommitTypes {
  /**
   * Descriptor for feat.
   */
  public static feat = { description: 'A new feature', title: 'Features' };

  /**
   * Descriptor for fix.
   */
  public static fix = { description: 'A bug fix', title: 'Bug Fixes' };

  /**
   * Descriptor for docs.
   */
  public static docs = { description: 'Documentation only changes', title: 'Documentation' };

  /**
   * Descriptor for style.
   */
  public static style = {
    description:
      'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    title: 'Styles',
  };

  /**
   * Descriptor for refactor.
   */
  public static refactor = {
    description: 'A code change that neither fixes a bug nor adds a feature',
    title: 'Code Refactoring',
  };

  /**
   * Descriptor for perf.
   */
  public static perf = { description: 'A code change that improves performance', title: 'Performance Improvements' };

  /**
   * Descriptor for test.
   */
  public static test = { description: 'Adding missing tests or correcting existing tests', title: 'Tests' };

  /**
   * Descriptor for build.
   */
  public static build = {
    description: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    title: 'Builds',
  };

  /**
   * Descriptor for ci.
   */
  public static ci = {
    description:
      'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
    title: 'Continuous Integrations',
  };

  /**
   * Descriptor for chore.
   */
  public static chore = { description: `Other changes that don't modify src or test files`, title: 'Chores' };

  /**
   * Descriptor for revert.
   */
  public static revert = { description: 'Reverts a previous commit', title: 'Reverts' };
}
