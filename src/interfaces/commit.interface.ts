import { AuthorInterface } from './author.interface';

export interface CommitInterface {
  hash: string;
  abbrevHash: string;
  author: AuthorInterface;
  subject: string;
  body: string[];
}
