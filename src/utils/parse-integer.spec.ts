import { parseInteger } from './parse-integer';
import { expect } from 'chai';

describe('parseInteger', () => {
  it('should return 0 if no input string is provided', () => {
    expect(parseInteger('')).to.equal(0);
  });

  it('should return 0 if integer cannot be extracted from string with native methods', () => {
    expect(parseInteger('test')).to.equal(0);
  });

  it('should return number contained in the string', () => {
    expect(parseInteger('1')).to.equal(1);
  });
});
