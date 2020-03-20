import { UpdateConfigFromArgv } from "./UpdateConfigFromArgv";
import { DefaultConfig } from "../GatherConfig";

describe("UpdateConfigFromArgv", () => {
  const updateConfigFromEnv = UpdateConfigFromArgv([
    "--user=test",
    "--publish-tag=false",
    "--write-temporary-files",
  ]);

  it("should override default values with those provided in env", async () => {
    const result = await updateConfigFromEnv.process(DefaultConfig);

    expect(result.user).toEqual("test");
  });

  it("should apply transformations for booleans", async () => {
    const result = await updateConfigFromEnv.process(DefaultConfig);

    expect(result.publishTag).toEqual(false);
  });

  it("should set options without value to true by default", async () => {
    const result = await updateConfigFromEnv.process(DefaultConfig);

    expect(result.writeTemporaryFiles).toEqual(true);
  });
});
