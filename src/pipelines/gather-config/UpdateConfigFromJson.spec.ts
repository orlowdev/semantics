import { UpdateConfigFromJson } from "./UpdateConfigFromJson";
import { ISemanticsIntermediate } from "../../interfaces/semantics-intermediate.interface";
import { unlinkSync, writeFileSync } from "fs";
import { Intermediate } from "@priestine/pipeline";
import { DefaultConfig } from "../GatherConfig";

describe("UpdateConfigFromJson", () => {
  it("should return unchanged intermediate if the file does not exist", async () => {
    expect(await UpdateConfigFromJson.process(DefaultConfig)).toEqual(
      DefaultConfig,
    );
  });

  it("should merge configuration if .semantics.json file is in place", async () => {
    const config: Partial<ISemanticsIntermediate> = {
      commitTypesIncludedInTagMessage: [
        {
          title: "Documentation",
          type: "docs",
          bumps: "patch",
        },
      ],
    };

    writeFileSync(".semantics.json", JSON.stringify(config), "utf8");
    const result: any = await UpdateConfigFromJson.process(DefaultConfig);
    expect(result.commitTypesIncludedInTagMessage[0].type).toEqual("docs");
    expect(result.excludeMerges).toEqual(true);
    unlinkSync(".semantics.json");
  });
});
