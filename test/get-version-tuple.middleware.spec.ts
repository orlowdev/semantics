import { getVersionTuple } from "../src/pipelines/build-new-version";

describe("getVersionTuple", () => {
  it("should default to [0,0,0] if there is no previous version tag", () => {
    expect(getVersionTuple({} as any).versionTuple).toEqual([0, 0, 0]);
  });

  it("should default to [0,0,0] if previous tag is not of semver kind", () => {
    expect(
      getVersionTuple({ latestVersionTag: "test" } as any).versionTuple,
    ).toEqual([0, 0, 0]);
    expect(
      getVersionTuple({ latestVersionTag: "0.beta" } as any).versionTuple,
    ).toEqual([0, 0, 0]);
  });

  it("should create a tuple of 3 integers representing the latest version", () => {
    expect(
      getVersionTuple({ latestVersionTag: "1.0.0" } as any).versionTuple,
    ).toEqual([1, 0, 0]);
  });
});
