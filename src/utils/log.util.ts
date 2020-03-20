import { Iro } from "@priestine/iro/src";

export namespace Log {
  export function info(...message): typeof Iro {
    return Iro.log(
      Iro.cyan(Iro.inverse(" SEMANTICS INFO    "), "  "),
      Iro.white(...message),
    );
  }

  export function success(...message): typeof Iro {
    return Iro.log(
      Iro.green(Iro.inverse(" SEMANTICS SUCCESS "), "  "),
      Iro.white(...message),
    );
  }

  export function warning(...message): typeof Iro {
    return Iro.log(
      Iro.yellow(Iro.inverse(" SEMANTICS WARNING "), "  "),
      Iro.white(...message),
    );
  }

  export function error(...message): typeof Iro {
    return Iro.log(
      Iro.red(Iro.inverse(" SEMANTICS ERROR   "), "  "),
      Iro.white(...message),
    );
  }

  export const tapInfo = (...message) => (intermediate) => {
    Log.info(...message);
    return intermediate;
  };

  export const tapSuccess = (...message) => (intermediate) => {
    Log.success(...message);
    return intermediate;
  };

  export const tapWarning = (...message) => (intermediate) => {
    Log.warning(...message);
    return intermediate;
  };

  export const tapError = (...message) => (intermediate) => {
    Log.error(...message);
    return intermediate;
  };
}
