import { CommitInterface } from '../interfaces/commit.interface';
import { CommitTypes } from '../types/commit-types';

export const extractCommitTypes = (commit: CommitInterface): CommitInterface => {
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
