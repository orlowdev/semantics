import { AuthorInterface } from './author.interface';
import { CommitTypes } from '../types/commit-types';

export interface CommitInterface {
  hash: string;
  abbrevHash: string;
  author: AuthorInterface;
  subject: string;
  body: string[];
  type: keyof typeof CommitTypes;
  breakingChanges: boolean;
  issueReference?: string;
}
