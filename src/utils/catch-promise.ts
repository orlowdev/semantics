import { Iro } from '@priestine/iro';

/**
 * Catch execPromise errors and put them to console.
 * @param e string
 */
export const catchError = (e: string): void => {
  Iro.error(`SEMANTICS ERROR ${e.toString()}`);
};
