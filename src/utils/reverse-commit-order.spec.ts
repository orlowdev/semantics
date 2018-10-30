import { expect } from 'chai';
import { reverseCommitOrder } from './reverse-commit-order';

describe('addVersionPrefix', () => {
  it('should return version if prefix is undefined', () => {
    expect(reverseCommitOrder([1,2,3] as any)).to.deep.equal([3,2,1]);
  });

  it('should prepend prefix to the version if it was provided', () => {
    process.argv.unshift('--reverse-order');
    expect(reverseCommitOrder([1,2,3] as any)).to.deep.equal([1,2,3]);
  });
});
