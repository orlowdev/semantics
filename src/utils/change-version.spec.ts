import { expect } from 'chai';
import { changeVersion } from './change-version';

describe('changeVersion', () => {
  it('should return a function', () => {
    expect(typeof changeVersion(undefined as any)).to.equal('function');
  });

  it('should return 1.0.0 if version is nully', () => {
    expect(changeVersion('0.0.0')(false, false, false)).to.equal('1.0.0');
  });

  it('should return raise major version if required', () => {
    expect(changeVersion('1.0.0')(true, false, false)).to.equal('2.0.0');
  });

  it('should drop minor and patch versions on raising major version', () => {
    expect(changeVersion('1.3.2')(true, false, false)).to.equal('2.0.0');
  });

  it('should return raise minor version if required', () => {
    expect(changeVersion('1.0.0')(false, true, false)).to.equal('1.1.0');
  });

  it('should drop patch versions on raising minor version', () => {
    expect(changeVersion('1.3.2')(false, true, false)).to.equal('1.4.0');
  });

  it('should return raise patch version if required', () => {
    expect(changeVersion('1.0.0')(false, false, true)).to.equal('1.0.1');
  });

  it('should return current version if no changes are required', () => {
    expect(changeVersion('1.0.0')(false, false, false)).to.equal('1.0.0');
  });

  it('should prioritize minor version over patch version', () => {
    expect(changeVersion('1.0.0')(false, true, true)).to.equal('1.1.0');
  });

  it('should prioritize major version over minor version', () => {
    expect(changeVersion('1.0.0')(true, true, false)).to.equal('2.0.0');
  });

  it('should prioritize major version over patch version', () => {
    expect(changeVersion('1.0.0')(true, false, true)).to.equal('2.0.0');
  });

  it('should prioritize major version over any version', () => {
    expect(changeVersion('1.0.0')(true, true, true)).to.equal('2.0.0');
  });
});
