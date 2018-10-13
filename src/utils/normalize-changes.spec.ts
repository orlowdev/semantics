import { expect } from 'chai';
import { normalizeChanges } from './normalize-changes';

describe('normalizeChanges', () => {
  it('should return array-like string', () => {
    expect(normalizeChanges('')).to.equal('[  ]');
  });

  it('should omit lines beginning with the word "commit"', () => {
    expect(normalizeChanges('commit SOMEHASH')).to.equal('[  ]');
  });

  it('should return relevant object-like data', () => {
    expect(normalizeChanges('{}')).to.equal('[ {} ]');
  });

  it('should join separate lines with a comma + space', () => {
    expect(normalizeChanges('{}\n{}')).to.equal('[ {}, {} ]');
  });
});
