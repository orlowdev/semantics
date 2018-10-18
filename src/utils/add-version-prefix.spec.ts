import { expect } from 'chai';
import { addVersionPrefix } from './add-version-prefix';

describe('addVersionPrefix', () => {
  it('should return version if prefix is undefined', () => {
    expect(addVersionPrefix('1.0.0')).to.equal('1.0.0');
  });

  it('should prepend prefix to the version if it was provided', () => {
    process.argv.unshift('--prefix=v');
    expect(addVersionPrefix('1.0.0')).to.equal('v1.0.0');
  });
});
