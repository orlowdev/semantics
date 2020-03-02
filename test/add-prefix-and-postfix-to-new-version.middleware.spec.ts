import { TSemanticsCtx } from "../src/interfaces/semantics-intermediate.interface";
import { addPrefixAndPostfixToNewVersion } from "../src/pipelines/build-new-version";

describe("addPrefixAndPostfixToNewVersion", () => {
  it("should add prefix and postfix to the new version value", () => {
    expect(
      addPrefixAndPostfixToNewVersion({
        intermediate: {
          prefix: "v",
          postfix: "-beta.0",
          newVersion: "1.0.0",
        },
      } as TSemanticsCtx).newVersion,
    ).toEqual("v1.0.0-beta.0");
  });
});
