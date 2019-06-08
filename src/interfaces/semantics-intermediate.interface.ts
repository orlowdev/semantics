import { ConfigInterface } from './config.interface';
import { MiddlewareContextInterface } from '@priestine/data';
import { CommitInterface } from './commit.interface';

export interface SemanticsIntermediate extends ConfigInterface {
  currentCommitHash: string;
  latestVersionTag: string;
  latestVersionCommitHash: string;
  commitsSinceLatestVersion: string | CommitInterface[];
  versionTuple: [number, number, number];
  newVersion: string;
  tagMessageContents: string;
}

export type SemanticsCtx = MiddlewareContextInterface<SemanticsIntermediate>;
