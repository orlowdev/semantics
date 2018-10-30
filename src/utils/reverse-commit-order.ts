import { CommitInterface } from '../interfaces/commit.interface';

export const reverseCommitOrder = (xs: CommitInterface[]) => {
  return process.argv.includes('--reverse-order')
    ? xs
    : xs.reverse()
  ;
}
