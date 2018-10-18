import { expect } from 'chai';
import { getPrivateToken } from './get-private-token';

describe('getPrivateToken', () => {
  it('should return empty token if none was provided', () => {
    expect(getPrivateToken()).to.equal('');
  });

  it('should return user-defined private token if it was provided as a command arg', () => {
    process.argv.unshift('--private-token=test');
    expect(getPrivateToken()).to.equal('test');
  });

  it('should return default GitLab URL if provided command arg is empty', () => {
    process.argv.unshift('--private-token=');
    expect(getPrivateToken()).to.equal('');
  });

  it('should return env-defined token if provided command arg is empty', () => {
    process.env.PRIVATE_TOKEN = 'test env';
    process.argv.unshift('--private-token=');
    expect(getPrivateToken()).to.equal('test env');
  });
});
