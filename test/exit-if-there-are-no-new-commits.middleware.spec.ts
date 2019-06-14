import { exitIfThereAreNoNewCommits } from '../src/middleware/exit-if-there-are-no-new-commits.middleware';
import { Log } from '../src/utils/log.util';
import { exitIfVersionIsNotUpdated } from '../src/middleware/exit-if-version-is-not-updated.middleware';
import { Iro } from '@priestine/iro/src';

describe('exitIfThereAreNoNewCommits', () => {
  const mockWarning = jest.spyOn(Log, 'warning').mockImplementation((x) => x);
  const mockSuccess = jest.spyOn(Log, 'success').mockImplementation((x) => x);

  it('should end the process if there are no new commits', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    exitIfThereAreNoNewCommits({
      intermediate: {
        latestVersionTag: '1.2.3',
        newVersion: '1.2.3',
        commitsSinceLatestVersion: [],
      },
    } as any);

    expect(mockExit).toHaveBeenCalledWith(0);
    expect(mockWarning).toHaveBeenCalledWith('There are no changes since last release. Terminating.');
  });

  it('should return unchanged intermediate for further middleware', () => {
    const ctx: any = {
      intermediate: {
        latestVersionTag: '1.2.3',
        newVersion: '1.3.0',
        commitsSinceLatestVersion: [{}]
      },
    };

    expect(exitIfVersionIsNotUpdated(ctx)).toEqual(undefined);
    expect(mockSuccess).toHaveBeenCalledWith(`New version candidate: ${Iro.green('1.3.0')}`);
  });
});
