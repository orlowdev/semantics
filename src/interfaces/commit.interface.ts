import { AuthorInterface } from './author.interface';
import { CommitTypes } from '../types/commit-types';

/**
 * Commit.
 * @interface CommitInterface
 */
export interface CommitInterface {
  hash: string;
  abbrevHash: string;
  author: AuthorInterface;
  subject: string;
  body: string[];
  footer: string[];
  type: string;
  breakingChanges: string[];
  issueReference?: string;
}
