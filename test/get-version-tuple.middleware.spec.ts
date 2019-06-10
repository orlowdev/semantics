import { getVersionTuple } from '../src/middleware/get-version-tuple.middleware';

describe('getVersionTuple', () => {
  it('should default to [0,0,0] if there is no previous version tag', () => {
    expect(getVersionTuple({ intermediate: {}} as any).versionTuple).toEqual([0,0,0]);
  });

  it('should default to [0,0,0] if previous tag is not of semver kind', () => {
    expect(getVersionTuple({ intermediate: { latestVersionTag: 'test' }} as any).versionTuple).toEqual([0,0,0]);
    expect(getVersionTuple({ intermediate: { latestVersionTag: '0.beta' }} as any).versionTuple).toEqual([0,0,0]);
  });

  it('should create a tuple of 3 integers representing the latest version', () => {
    expect(getVersionTuple({ intermediate: { latestVersionTag: '1.0.0'}} as any).versionTuple).toEqual([1,0,0]);
  });
});
