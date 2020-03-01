import { CommitTypeInterface } from './commit-type.interface';

/**
 * ConfigInterface provides the description of configurable parts of @priestine/semantics. Each entry can be set via
 * environment variable or command line argument.
 *
 * To use environment variables in upper-snake case, e.g. `PRIVATE_TOKEN=$TOKEN` for `password`.
 * To use CL args, use long options in kebab case, e.g. `--private-token=$TOKEN` for `password`.
 *
 * **NOTE**: environment variable values take precedence over CL arg values. See To Do section below for planned
 * features on configuration control. After these features are implemented, the following order of assignment will
 * be in place (rightmost being the highest priority and overriding preceding values):
 *
 * defaults -> package.json | semantics.config.js | semantics.{json|yml|yaml} | .semanticsrc -> args -> ENV
 */
export interface ConfigInterface {
  /**
   * Private token for publishing to chosen platform. Refer to according docs section on how to get private token.
   *
   * @default ""
   */
  password: string;

  /**
   * Git user that is used to push changes to the repo.
   */
  user: string;

  /**
   * If true, @priestine/semantics will attempt to publish a release tag to the chosen platform.
   *
   * Requires `password` and `projectPath` to be provided.
   *
   * @default true
   */
  publishTag: boolean;

  /**
   * If true, commits will be sorted chronologically oldest to latest.
   *
   * @default true
   */
  oldestCommitsFirst: boolean;

  /**
   * If true, changelog will include authors of each commit. Not implemented.
   *
   * @default false
   */
  displayAuthor: boolean;

  /**
   * A list of commit types that are included in tag release notes.
   * Each item is an object that describes the following:
   *
   * 1) type - type of commit to be looked for (@see https://www.conventionalcommits.org/en/v1.0.0-beta.4/#specification)
   * 2) title - header to be used in the changelog
   * 3) bumps (optional) - `patch`, `minor` or `major` - tells @priestine/semantics that commits of this type require
   * specified version part bumping
   *
   * @default includes fix and feat types
   */
  commitTypesIncludedInTagMessage: CommitTypeInterface[];

  /**
   * A list of commit types that are excluded from the release notes.
   * Each item is a string that represents type of commit.
   *
   * **NOTE**: if commit type is excluded, it cannot bump versions
   * **ALSO NOTE**: if commit type is present in both included and excluded lists,
   * the exclusion list takes precedence.
   *
   * For example, ou can disable bumping patch versions with `fix` by adding `fix` to this array.
   *
   * @default []
   */
  commitTypesExcludedFromTagMessage: string[];

  /**
   * Optional prefix that will be prepended to the version (e.g. `v` will result in **v1.0.0**).
   *
   * @default ""
   */
  prefix: string;

  /**
   * Optional postfix that will be appended to the version (e.g. `-beta` will result in **1.0.0-beta**).
   *
   * @default ""
   */
  postfix: string;

  /**
   * Custom remote git origin to push tags to. If it is not specified, updates are pushed to the current
   * repository. This option may be useful when mirroring repositories, e.g. using Gitlab CI for a Github
   * project. Providing authentication credentials is optional. The origin MUST be using HTTP, not SSH.
   *
   * @default ""
   */
  origin: string;

  /**
   * Relative or absolute path to the directory where @priestine/semantics should look for config files.
   *
   * Not implemented.
   *
   * @default "./"
   */
  configFilePath: string;

  /**
   * If true, @priestine/semantics will emit temporary files containing the data gathered during its
   * execution.
   *
   * 1) .tmp.changelog.md - a Markdown file containing the release notes
   * 2) .tmp.current_changes.json - a JSON file containing list of all changes found since latest release
   * 3) .tmp.current_commit_data - current commit hash
   * 4) .tmp.current_tag_data - name of the latest tag
   * 5) .tmp.version_data - version to be published
   *
   * **NOTE**: Temporary files do not get generated if there are no reasons for version bumping.
   *
   * @default false
   */
  writeTemporaryFiles: boolean;

  /**
   * If true, @priestine/semantics will look for previous versions with given prefix and/or postfix.
   * Otherwise, any previous SemVer tag will be referred to as previous version.
   *
   * This is helpful if you lead several changelogs for various types of releases.
   *
   * For example, you can publish your final releases with `v` prefix and precise version matching turned on,
   * whereas your RC releases will have prefix `v`, postfix `-rc` and precise version matching turned off.
   * Thus, all your final releases will "contain" multiple RC releases but only raise with one digit up,
   * even if your RC releases suggested more changes:
   *
   * This can potentially be useful in collecting additional information about the development process internals.
   *
   * @default true
   */
  preciseVersionMatching: boolean;

  /**
   * If true, merge commits will be excluded when evaluating changes. Set to false if you prefer to use Conventional
   * Commits format in merge request commits and assign version bumping there.
   *
   * Maybe useful for key/lead developers in charge of an issue.
   *
   * @default true
   */
  excludeMerges: boolean;

  /**
   * If true, CHANGELOG.md file in the root directory of the project will be prepended with the changes in the newly
   * tagged version.
   *
   * @default true
   */
  writeToChangelog: boolean;
}
