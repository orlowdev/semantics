import { expect } from 'chai';
import { getAmendPatch } from './get-amend-patch';
import { TestCommits } from '../index.spec';

describe('getAmendPatch', () => {
  it('should return false if commits array is empty', () => {
    expect(getAmendPatch([])).to.be.false;
  });

  it('should return false if there are not breaking change commits', () => {
    expect(getAmendPatch([TestCommits[0] as any])).to.be.false;
  });

  it('should return true if there are breaking change commits', () => {
    expect(getAmendPatch(TestCommits as any)).to.be.true;
  });
});
