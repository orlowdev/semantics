import { CommitInterface } from '../interfaces/commit.interface';
import { CommitTypes } from '../types/commit-types';

/**
 * Extract type from the commit subject and amend subject itself for later use.
 * @todo:priestine Refactor this into separate functions
 * @param commit CommitInterface
 * @returns CommitInterface
 */
export const extractCommitTypes = (commit: CommitInterface): CommitInterface => {
  if (commit.subject.indexOf(': ') === -1) {
    commit.subject = `fix: ${commit.subject}`;
  }

  const subject = commit.subject.split(': ');
  const issueReferenceRx = /\((#\d+)\)/;

  let typePredicate = subject[0];

  if (issueReferenceRx.test(typePredicate)) {
    commit.issueReference = typePredicate.match(issueReferenceRx)[1];
    typePredicate = typePredicate.replace(issueReferenceRx, '');
  }

  commit.subject = subject[1];

  commit.type = typePredicate as any;

  return commit;
};
