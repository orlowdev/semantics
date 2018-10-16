/**
 * Remove the commit lines and return incoming changes wrapped into square brackets.
 * @param changes String containing commit information
 * @returns string
 */
export const normalizeChanges = (changes: string): string =>
  `[ ${changes
    .split('\n')
    .reduce((r: string[], x: string) => {
      if (/^commit/.test(x)) {
        return r;
      }

      x = x.replace(/"/g, '`');

      return r.concat([x]);
    }, [])
    .join(', ')} ]`.replace(/\^\^\^/g, '"');
