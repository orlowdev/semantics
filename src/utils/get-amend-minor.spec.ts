import { expect } from 'chai';
import { getAmendMinor } from './get-amend-minor';
import { TestCommits } from '../index.spec';

describe('getAmendMinor', () => {
  it('should return false if commits array is empty', () => {
    expect(getAmendMinor([])).to.be.false;
  });

  it('should return false if there are not breaking change commits', () => {
    expect(getAmendMinor([TestCommits[0] as any])).to.be.false;
  });

  it('should return true if there are breaking change commits', () => {
    expect(getAmendMinor(TestCommits as any)).to.be.true;
  });
});
