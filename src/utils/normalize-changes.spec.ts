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

  it('should correctly replace string tokens from commit format template', () => {
    expect(normalizeChanges('{ ^^^name^^^: ^^^test^^^ }')).to.equal('[ { "name": "test" } ]');
  });

  it('should correctly replace multiple spaces and tabs with singe spaces', () => {
    expect(normalizeChanges('{ ^^^check^^^: ^^^test:    1^^^ }')).to.equal('[ { "check": "test: 1" } ]');
  });

  it('should correctly replace double quotes coming from commits', () => {
    expect(normalizeChanges('{ ^^^name^^^: ^^^"test"^^^ }')).to.equal('[ { "name": "\'test\'" } ]');
  });
});
