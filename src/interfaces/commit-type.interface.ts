/**
 * ICommitType describes the object that can be passed to Config.commitTypesIncludedInTagMessage array.
 * By default, this array includes:
 * - { title: "Bug Fixes", type: "fix", bumps: "patch" }
 * - { title: "New Features", type: "feat", bumps: "minor" }
 *
 * If you want to disable default settings, pass their type to the Config.commitTypesExcludedFromTagMessage array.
 *
 * **NOTE**: You cannot disable bumping major versions via BREAKING CHANGE. If you do not want this behaviour, do not
 * state `BREAKING CHANGE: ` metadata in commits.
 */
export interface ICommitType {
  /**
   * Title to be used in the release notes as the commit type group header.
   */
  title: string;

  /**
   * Commit type to be looked for (@see https://www.conventionalcommits.org/en/v1.0.0-beta.4/#specification).
   */
  type: string;

  /**
   * Optional value describing if commits of this type should bump appropriate digit if they are found since last release.
   */
  bumps?: "patch" | "minor" | "major";
}
