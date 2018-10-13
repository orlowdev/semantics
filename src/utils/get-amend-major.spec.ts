import { expect } from 'chai';
import { getAmendMajor } from './get-amend-major';
import { TestCommits } from '../index.spec';

describe('getAmendMajor', () => {
  it('should return false if commits array is empty', () => {
    expect(getAmendMajor([])).to.be.false;
  });

  it('should return false if there are not breaking change commits', () => {
    expect(getAmendMajor([TestCommits[0] as any])).to.be.false;
  });

  it('should return true if there are breaking change commits', () => {
    expect(getAmendMajor(TestCommits as any)).to.be.true;
  });
});
