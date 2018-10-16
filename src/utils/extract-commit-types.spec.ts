import { expect } from 'chai';
import { extractCommitTypes } from './extract-commit-types';

describe('extractCommitTypes', () => {
  it('should assign fix type if commit is non-conventional', () => {
    expect(extractCommitTypes({ subject: 'test' } as any).type).to.equal('fix');
  });

  it('should mark issue reference if commit scope includes a #', () => {
    expect(extractCommitTypes({ subject: 'chore(#1): test'} as any).issueReference).to.equal('#1');
  });
});
