import { CommitTypeInterface } from './commit-type.interface';

export interface ConfigInterface {
  /**
   * @default github
   */
  repository: 'github' | 'gitlab';

  privateToken: string;

  projectPath: string;

  /**
   * @default true
   */
  publishTag: boolean;

  /**
   * @default false
   */
  createTemporaryFiles: boolean;

  /**
   * @default true
   */
  oldestCommitsFirst: boolean;

  /**
   * @default false
   */
  displayAuthor: boolean;

  /**
   * @default includes fix and feat types
   */
  commitTypesIncludedInTagMessage: CommitTypeInterface[];

  /**
   * @default []
   */
  commitTypesExcludedFromTagMessage: string[];

  /**
   * @default true
   */
  tagMessage: boolean;

  /**
   * @default ""
   */
  prefix: string;

  /**
   * @default ""
   */
  postfix: string;

  /**
   * @default "./"
   */
  configFilePath: string;

  /**
   * @default false
   */
  writeTemporaryFiles: boolean;

  /**
   * @default true
   */
  preciseVersionMatching: boolean;
}
