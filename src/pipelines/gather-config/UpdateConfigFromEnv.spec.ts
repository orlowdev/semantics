import { UpdateConfigFromEnv } from "./UpdateConfigFromEnv";
import { DefaultConfig } from "../GatherConfig";

describe("UpdateConfigFromEnv", () => {
  const updateConfigFromEnv = UpdateConfigFromEnv({
    USER: "test",
    PUBLISH_TAG: "false",
  });

  it("should override default values with those provided in env", async () => {
    const result: any = await updateConfigFromEnv.process(DefaultConfig);

    expect(result.user).toEqual("test");
  });

  it("should apply transformations for booleans", async () => {
    const result: any = await updateConfigFromEnv.process(DefaultConfig);

    expect(result.publishTag).toEqual(false);
  });
});
