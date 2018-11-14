import { ICommitType } from '../interfaces/commit-type.interface';

/**
 * Commit type descriptor based on Conventional Changelog.
 * @class CommitTypes
 * @abstract
 */
export const CommitTypes: ICommitType[] = [
  {
    type: 'feat',
    description: 'A new feature',
    title: 'Features',
    display: true,
  },
  {
    type: 'fix',
    description: 'A bug fix',
    title: 'Bug Fixes',
    display: true,
  },
  {
    type: 'docs',
    description: 'Documentation only changes',
    title: 'Documentation',
    display: true,
  },
  {
    type: 'style',
    description:
      'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    title: 'Styles',
    display: true,
  },
  {
    type: 'refactor',
    description: 'A code change that neither fixes a bug nor adds a feature',
    title: 'Code Refactoring',
    display: true,
  },
  {
    type: 'perf',
    description: 'A code change that improves performance',
    title: 'Performance Improvements',
    display: true,
  },
  {
    type: 'test',
    description: 'Adding missing tests or correcting existing tests',
    title: 'Tests',
    display: true,
  },
  {
    type: 'build',
    description: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    title: 'Builds',
    display: true,
  },
  {
    type: 'ci',
    description:
      'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
    title: 'Continuous Integrations',
    display: true,
  },
  {
    type: 'chore',
    description: `Other changes that don't modify src or test files`,
    title: 'Chores',
    display: true,
  },
  {
    type: 'revert',
    description: 'Reverts a previous commit',
    title: 'Reverts',
    display: true,
  },
];
