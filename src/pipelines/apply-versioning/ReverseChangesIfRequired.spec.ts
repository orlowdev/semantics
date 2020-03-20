import { Log } from "../../utils/log.util";
import { ReverseChangesIfRequired } from "./ReverseChangesIfRequired";
import { Intermediate } from "@priestine/pipeline";

describe("ReverseChangesIfRequired", () => {
  describe("logging", () => {
    const mockWarning = jest.spyOn(Log, "info").mockImplementation((x) => x);

    it("should log proper sorting message with descending order", () => {
      ReverseChangesIfRequired.process(
        Intermediate.of({ oldestCommitsFirst: false }),
      );

      expect(mockWarning).toHaveBeenCalledWith(
        "Changes will be ordered by commit date in descending order (newest first).",
      );
    });

    it("should log proper sorting message with ascending order", () => {
      ReverseChangesIfRequired.process(
        Intermediate.of({ oldestCommitsFirst: true }),
      );

      expect(mockWarning).toHaveBeenCalledWith(
        "Changes will be ordered by commit date in ascending order (oldest first).",
      );
    });
  });
});
