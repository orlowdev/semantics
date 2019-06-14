import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';

export function normalizeCommitsString({ intermediate }: SemanticsCtx) {
  return {
    ...intermediate,
    commitsSinceLatestVersionString: `[ ${intermediate.commitsSinceLatestVersionString
      .split('\n')
      .reduce((acc: string[], line: string) => {
        // Skip lines containing commit hash
        if (/^commit/.test(line)) {
          return acc;
        }

        return acc.concat([
          line
            .replace(/"/g, `'`)
            .replace(/\s+/g, ' ')
            .replace(/\n/g, ''),
        ]);
      }, [])
      .join(', ')} ]`.replace(/\^\^\^/g, '"'),
  };
}
