import { bumpMajorVersion, bumpMinorVersion, bumpPatchVersion } from '../src/middleware/bump-version.middleware';

describe('bumpPatchVersion', () => {
  it('should bump version properly if there are patch version update commits', () => {
    expect(
      bumpPatchVersion({
        intermediate: {
          versionTuple: [4, 5, 6],
          commitsSinceLatestVersion: [
            {
              hasPatchUpdate: true,
            },
          ],
        },
      } as any).newVersion
    ).toEqual('4.5.7');
  });

  it('should not bump version if there are no version update commits', () => {
    expect(
      bumpPatchVersion({
        intermediate: {
          versionTuple: [4, 5, 6],
          commitsSinceLatestVersion: [],
          newVersion: '1.2.3',
        },
      } as any).newVersion
    ).toEqual('1.2.3');
  });
});

describe('bumpMinorVersion', () => {
  it('should bump version if there are minor version update commits', () => {
    expect(
      bumpMinorVersion({
        intermediate: {
          versionTuple: [4, 5, 6],
          commitsSinceLatestVersion: [
            {
              hasMinorUpdate: true,
            },
          ],
        },
      } as any).newVersion
    ).toEqual('4.6.0');
  });

  it('should not bump version if there are no version update commits', () => {
    expect(
      bumpMinorVersion({
        intermediate: {
          versionTuple: [4, 5, 6],
          commitsSinceLatestVersion: [],
          newVersion: '1.2.3',
        },
      } as any).newVersion
    ).toEqual('1.2.3');
  });
});

describe('bumpMajorVersion', () => {
  it('should bump version if there are major version update commits', () => {
    expect(
      bumpMajorVersion({
        intermediate: {
          versionTuple: [4, 5, 6],
          commitsSinceLatestVersion: [
            {
              hasMajorUpdate: true,
            },
          ],
        },
      } as any).newVersion
    ).toEqual('5.0.0');
  });

  it('should not bump version if there are no version update commits', () => {
    expect(
      bumpMajorVersion({
        intermediate: {
          versionTuple: [4, 5, 6],
          commitsSinceLatestVersion: [],
          newVersion: '1.2.3',
        },
      } as any).newVersion
    ).toEqual('1.2.3');
  });

  it('should bump major version if there was no previous version', () => {
    expect(
      bumpMajorVersion({
        intermediate: {
          versionTuple: [0, 0, 0],
          commitsSinceLatestVersion: [],
        },
      } as any).newVersion
    ).toEqual('1.0.0');
  });

  it('should use previous version if major version bumping is not applicable', () => {
    expect(
      bumpMajorVersion({
        intermediate: {
          versionTuple: [1, 2, 3],
          commitsSinceLatestVersion: [],
        },
      } as any).newVersion
    ).toEqual('1.2.3');
  });
});
