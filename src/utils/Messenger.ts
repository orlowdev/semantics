import { Shell } from '@totemish/shell';
import * as R from 'ramda';

export abstract class Messenger {
  public static info(...message): typeof Shell {
    return Shell.write(Shell.cyan(Shell.inverse(' SEMANTICS INFO    '), '  '), Shell.white(...message));
  }

  public static success(...message): typeof Shell {
    return Shell.write(Shell.green(Shell.inverse(' SEMANTICS SUCCESS '), '  '), Shell.white(...message));
  }

  public static warning(...message): typeof Shell {
    return Shell.write(Shell.yellow(Shell.inverse(' SEMANTICS WARNING '), '  '), Shell.white(...message));
  }
  public static error(...message): typeof Shell {
    return Shell.write(Shell.red(Shell.inverse(' SEMANTICS ERROR   '), '  '), Shell.white(...message));
  }

  public static tapInfo = (...message) => R.tap(() => Messenger.info(message));
  public static tapSuccess = (...message) => R.tap(() => Messenger.success(message));
  public static tapWarning = (...message) => R.tap(() => Messenger.warning(message));
  public static tapError = (...message) => R.tap(() => Messenger.error(message));
}
