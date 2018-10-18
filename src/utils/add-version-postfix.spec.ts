import { expect } from 'chai';
import { addVersionPostfix } from './add-version-postfix';

describe('addVersionPostfix', () => {
  it('should return version if postfix is undefined', () => {
    expect(addVersionPostfix('1.0.0')).to.equal('1.0.0');
  });

  it('should append postfix to the version if it was provided', () => {
    process.argv.unshift('--postfix=-beta');
    expect(addVersionPostfix('1.0.0')).to.equal('1.0.0-beta');
  });
});
