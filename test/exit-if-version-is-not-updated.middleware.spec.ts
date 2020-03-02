import { Log } from "../src/utils/log.util";
import { Iro } from "@priestine/iro/src";
import { exitIfVersionIsNotUpdated } from "../src/pipelines/exit-if-no-bumping";

describe("exitIfVersionIsNotUpdated", () => {
  const mockWarning = jest.spyOn(Log, "warning").mockImplementation((x) => x);
  const mockSuccess = jest.spyOn(Log, "success").mockImplementation((x) => x);

  it("should end the process if the version is not updated", () => {
    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as any);
    exitIfVersionIsNotUpdated({
      intermediate: {
        latestVersionTag: "1.2.3",
        newVersion: "1.2.3",
      },
    } as any);

    expect(mockExit).toHaveBeenCalledWith(0);
    expect(mockWarning).toHaveBeenCalledWith(
      "Evaluated changes do not require version bumping. Terminating.",
    );
  });

  it("should return unchanged intermediate for further middleware", () => {
    const ctx: any = {
      intermediate: {
        latestVersionTag: "1.2.3",
        newVersion: "1.3.0",
      },
    };

    expect(exitIfVersionIsNotUpdated(ctx)).toEqual(undefined);
    expect(mockSuccess).toHaveBeenCalledWith(
      `New version candidate: ${Iro.green("1.3.0")}`,
    );
  });
});
