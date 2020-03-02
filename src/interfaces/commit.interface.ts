/**
 * ICommitAuthor describes the commit author entity.
 */
export interface ICommitAuthor {
  name: string;
  email: string;
}

/**
 * ICommit describes the commit entity stored in ISemanticsIntermediate.commitsSinceLatestVersion array.
 */
export interface ICommit {
  /**
   * Full commit hash.
   */
  hash: string;

  /**
   * Abbreviated commit hash.
   */
  abbrevHash: string;

  /**
   * Commit author.
   */
  author: ICommitAuthor;

  /**
   * Commit description (the one that goes after colon on the first line of the commit).
   * @see https://www.conventionalcommits.org/en/v1.0.0-beta.4/#specification
   */
  description: string;

  /**
   * Commit body (the one that starts with one blank line after description).
   */
  body: string[];

  /**
   * Commit footer (the one that starts with one blank line after the body).
   */
  footer: string[];

  /**
   * Commit type (the one that goes before colon on the first line of the commit).
   */
  type: string;

  /**
   * Flag that specifies that with this commit, at least patch version must be updated.
   * By default, `fix`-type commits get this set to true.
   */
  hasPatchUpdate: boolean;

  /**
   * Flag that specifies that with this commit, at least minor version must be updated.
   * By default, `feat`-type commits get this set to true.
   */
  hasMinorUpdate: boolean;

  /**
   * Flag that specifies that with this commit, major version must be updated.
   * By default, commits with `BREAKING CHANGE: ` in their metadata get this set to true.
   */
  hasMajorUpdate: boolean;

  /**
   * Optional scope (section of the codebase) of the commit.
   */
  scope?: string;

  /**
   * Array of breaking changes found in the commit footer.
   */
  breakingChanges: string[];
}
