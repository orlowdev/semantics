import { expect } from 'chai';
import { getGitLabURL } from './get-gitlab-url';

describe('getGitlabURL', () => {
  it('should return default GitLab URL if none was provided', () => {
    expect(getGitLabURL()).to.equal('https://gitlab.com/api/v4');
  });

  it('should return user-defined GitLab URL if it was provided as a command arg', () => {
    process.argv.unshift('--custom-domain=http://test.com');
    expect(getGitLabURL()).to.equal('http://test.com');
  });

  it('should return default GitLab URL if provided command arg is empty', () => {
    process.argv.unshift('--custom-domain=');
    expect(getGitLabURL()).to.equal('https://gitlab.com/api/v4');
  });
});
