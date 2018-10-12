import { Shell } from '@totemish/shell';

/**
 * Catch execPromise errors and put them to console.
 * @param e string
 */
export const catchError = (e: string): void => {
  Shell.error(e.toString());
};
