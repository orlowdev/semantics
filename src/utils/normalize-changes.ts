export const normalizeChanges = (changes: string): string =>
  `[ ${changes
    .split('\n')
    .reduce((r: string[], x: string) => (/^commit/.test(x) ? r : r.concat([x])), [])
    .join(', ')} ]`;
