import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';
import { CommitInterface } from '../interfaces/commit.interface';
import { Iro } from '@priestine/iro/src';

/**
 * Extract commit subjects and transform them into readable form.
 * @param xs CommitInterface[]
 * @returns string[]
 */
export const getSubjects = (xs: CommitInterface[]) => (type: string): string[] =>
  xs
    .filter((x: CommitInterface) => x.type === type)
    .map(
      (x: CommitInterface) =>
        `${x.scope ? `${x.scope} ` : ''}${x.description} ${x.abbrevHash}${
          x.body.length ? `\n\n  * ${x.body.join('<br/>\n  * ')}\n` : ''
        }`
    );

/**
 * Extract breaking changes from commit body.
 * @param commit CommitInterface
 * @returns CommitInterface
 */
export const extractBreakingChanges = (commit: CommitInterface): CommitInterface => {
  commit.breakingChanges =
    commit.body
      .filter((x: string) => /^BREAKING\sCHANGE:/.test(x))
      .map((x: string) => x.replace(/^BREAKING\sCHANGE:/, '').trim()) || [];
  commit.body = commit.body.filter((x: string) => !/^BREAKING\sCHANGE:/.test(x));

  return commit;
};

/**
 * Extract type from the commit subject and amend subject itself for later use.
 * @todo:priestine Refactor this into separate functions
 * @param commit CommitInterface
 * @returns CommitInterface
 */
export const extractCommitTypes = (commit: CommitInterface): CommitInterface => {
  if (commit.description.indexOf(': ') === -1) {
    commit.description = `fix: ${commit.description}`;
  }

  const description = commit.description.split(': ');

  const scopeRx = /\((.+)\)/;

  let typePredicate = description[0];

  if (scopeRx.test(typePredicate)) {
    description[1] = `(${typePredicate.match(scopeRx)[1]}) ${description[1]}`;
    typePredicate = typePredicate.replace(scopeRx, '');
  }

  commit.description = description[1];

  commit.type = typePredicate as any;

  return commit;
};

/**
 * Transform non-normalized commit body string into array of strings.
 * If body string contains an asterisk (*), it will be automatically trimmed.
 * @param commit CommitInterface
 * @returns CommitInterface
 */
export const normalizeBody = (commit: CommitInterface): CommitInterface => {
  commit.body = (commit.body as any)
    .split(', ')
    .reduce(
      (r: string[], x: string) => (x ? r.concat([/^(\*|-)\s+/.test(x) ? x.replace(/^(\*|-)\s+/, '') : x]) : r),
      []
    );
  return commit;
};

export function transformCommitsStringToObjects({ intermediate }: SemanticsCtx) {
  const result = JSON.parse(intermediate.commitsSinceLatestVersion as any);
  Log.success(`Commits found since latest version: ${Iro.green(result.length)}`);
  return {
    ...intermediate,
    commitsSinceLatestVersion: result
      .map(normalizeBody)
      .map(extractCommitTypes)
      .map(extractBreakingChanges)
      // TODO: Extract
      .map((commit: CommitInterface) => {
        const whitelistedType = intermediate.commitTypesIncludedInTagMessage.find((c) => c.type === commit.type);

        if (!whitelistedType) {
          return commit;
        }

        if (whitelistedType.bumps === 'patch') {
          commit.hasPatchUpdate = true;
        } else if (whitelistedType.bumps === 'minor') {
          commit.hasMinorUpdate = true;
        }

        if (commit.breakingChanges.length || whitelistedType.bumps === 'major') {
          commit.hasMajorUpdate = true;
        }

        return commit;
      }),
  };
}
