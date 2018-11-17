import { Iro } from '@priestine/iro';
import * as R from 'ramda';

export abstract class Messenger {
  public static info(...message): typeof Iro {
    return Iro.log(Iro.cyan(Iro.inverse(' SEMANTICS INFO    '), '  '), Iro.white(...message));
  }

  public static success(...message): typeof Iro {
    return Iro.log(Iro.green(Iro.inverse(' SEMANTICS SUCCESS '), '  '), Iro.white(...message));
  }

  public static warning(...message): typeof Iro {
    return Iro.log(Iro.yellow(Iro.inverse(' SEMANTICS WARNING '), '  '), Iro.white(...message));
  }
  public static error(...message): typeof Iro {
    return Iro.log(Iro.red(Iro.inverse(' SEMANTICS ERROR   '), '  '), Iro.white(...message));
  }

  public static tapInfo = (...message) => R.tap(() => Messenger.info(...message));
  public static tapSuccess = (...message) => R.tap(() => Messenger.success(...message));
  public static tapWarning = (...message) => R.tap(() => Messenger.warning(...message));
  public static tapError = (...message) => R.tap(() => Messenger.error(...message));
}
