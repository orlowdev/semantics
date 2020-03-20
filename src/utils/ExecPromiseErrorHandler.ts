import { Log } from "./log.util";

export const ExecPromiseErrorHandler = (e: string) => {
  Log.error(e.replace("\n", "->"));
  process.exit(1);
};
