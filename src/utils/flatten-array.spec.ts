import { expect } from 'chai';
import { flatten } from './flatten-array';

describe('flatten', () => {
  it('should return non-changed array if it is empty', () => {
    expect(flatten([1, 2, 3])).to.include(1);
    expect(flatten([1, 2, 3])).to.include(2);
    expect(flatten([1, 2, 3])).to.include(3);
    expect(flatten([1, 2, 3]).length).to.equal(3);
  });

  it('should return flattened array', () => {
    expect(flatten([1, [2, 3], 4])).to.include(1);
    expect(flatten([1, [2, 3], 4])).to.include(2);
    expect(flatten([1, [2, 3], 4])).to.include(3);
    expect(flatten([1, [2, 3], 4])).to.include(4);
    expect(flatten([1, [2, 3], 4]).length).to.equal(4);
  });

  it('should return flattened array more than 1 layer deep', () => {
    expect(flatten([1, [2, [3]], 4])).to.include(1);
    expect(flatten([1, [2, [3, 5]], 4])).to.include(5);
    expect(flatten([1, [2, [3, [[7]]]], 4])).to.include(7);
    expect(flatten([1, [2, [3]], 4]).length).to.equal(4);
  });

  it('should return only unique values', () => {
    expect(flatten([1, [1]]).length).to.equal(1);
  });
});
