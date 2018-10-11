import { AuthorInterface } from './author.interface';

export interface DenormalizedCommitInterface {
  hash: string;
  abbrevHash: string;
  author: AuthorInterface;
  subject: string;
  body: string;
}
