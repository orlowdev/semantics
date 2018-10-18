import { expect } from 'chai';
import { getCurrentVersion } from './get-current-version';

describe('getCurrentVersion', () => {
  it('should return [0, 0, 0] if there is no current tag', () => {
    expect(getCurrentVersion(undefined).length).to.equal(3);
    expect(getCurrentVersion(undefined)[0]).to.equal(0);
    expect(getCurrentVersion(undefined)[1]).to.equal(0);
    expect(getCurrentVersion(undefined)[2]).to.equal(0);
  });

  it('should return current tag transformed into [number, number, number] tuple', () => {
    expect(getCurrentVersion('1.0.0')[0]).to.equal(1);
    expect(getCurrentVersion('1.0.0')[1]).to.equal(0);
    expect(getCurrentVersion('1.0.0')[2]).to.equal(0);
  });

  it('should return [0, 0, 0] if current tag does not contain a version', () => {
    expect(getCurrentVersion('dev')[0]).to.equal(0);
    expect(getCurrentVersion('dev')[1]).to.equal(0);
    expect(getCurrentVersion('dev')[2]).to.equal(0);
    expect(getCurrentVersion('1.2')[0]).to.equal(0);
    expect(getCurrentVersion('1.2')[1]).to.equal(0);
    expect(getCurrentVersion('1.2')[2]).to.equal(0);
  });

  it('should return current version from tag even if it has prefixes', () => {
    expect(getCurrentVersion('rc-0.1.1')[0]).to.equal(0);
    expect(getCurrentVersion('rc-0.1.1')[1]).to.equal(1);
    expect(getCurrentVersion('rc-0.1.1')[2]).to.equal(1);
  });

  it('should return current version from tag even if it has postfixes', () => {
    expect(getCurrentVersion('0.1.1-beta')[0]).to.equal(0);
    expect(getCurrentVersion('0.1.1-beta')[1]).to.equal(1);
    expect(getCurrentVersion('0.1.1-beta')[2]).to.equal(1);
  });
});
