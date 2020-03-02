import { IntermediatePipeline } from "@priestine/pipeline";
import { SemanticsCtx } from "../interfaces/semantics-intermediate.interface";
import { ICommit } from "../interfaces/commit.interface";
import { Log } from "../utils/log.util";
import { Iro } from "@priestine/iro/src";

export function normalizeCommitsString({ intermediate }: SemanticsCtx) {
  return {
    ...intermediate,
    commitsSinceLatestVersionString: `[ ${intermediate.commitsSinceLatestVersionString
      .split("\n")
      .reduce((acc: string[], line: string) => {
        // Skip lines containing commit hash
        if (/^commit/.test(line)) {
          return acc;
        }

        return acc.concat([
          line
            .replace(/"/g, `'`)
            .replace(/\s+/g, " ")
            .replace(/\n/g, ""),
        ]);
      }, [])
      .join(", ")} ]`.replace(/\^\^\^/g, '"'),
  };
}

/**
 * Extract breaking changes from commit body.
 * @param commit ICommit
 * @returns ICommit
 */
export const extractBreakingChanges = (commit: ICommit): ICommit => {
  commit.breakingChanges =
    commit.body
      .filter((x: string) => /^BREAKING\sCHANGE:/.test(x))
      .map((x: string) => x.replace(/^BREAKING\sCHANGE:/, "").trim()) || [];
  commit.body = commit.body.filter(
    (x: string) => !/^BREAKING\sCHANGE:/.test(x),
  );

  return commit;
};

/**
 * Extract type from the commit subject and amend subject itself for later use.
 * @todo:priestine Refactor this into separate functions
 * @param commit ICommit
 * @returns ICommit
 */
export const extractCommitTypes = (commit: ICommit): ICommit => {
  if (commit.description.indexOf(": ") === -1) {
    commit.description = `fix: ${commit.description}`;
  }

  const description = commit.description.split(": ");

  const scopeRx = /\((.+)\)/;

  let typePredicate = description[0];

  if (scopeRx.test(typePredicate)) {
    description[1] = `(${typePredicate.match(scopeRx)[1]}) ${description[1]}`;
    typePredicate = typePredicate.replace(scopeRx, "");
  }

  commit.description = description[1];

  commit.type = typePredicate.replace(/!$/, "");

  return commit;
};

/**
 * Transform non-normalized commit body string into array of strings.
 * If body string contains an asterisk (*), it will be automatically trimmed.
 * @param commit ICommit
 * @returns ICommit
 */
export const normalizeBody = (commit: ICommit): ICommit => {
  commit.body = (commit.body as any)
    .split(", ")
    .reduce((r: string[], x: string) => {
      // Only consider parts of the body that are not for automatic issue closing
      // @see https://help.github.com/en/articles/closing-issues-using-keywords
      // @see https://docs.gitlab.com/ee/user/project/issues/automatic_issue_closing.html
      if (
        x &&
        !/clos(e|ed|es|ing)\s.*(#|http)/i.test(x) &&
        !/resolv(e|ed|es|ing)\s.*(#|http)/i.test(x) &&
        !/fix(e|ed|es|ing)\s.*(#|http)/i.test(x) &&
        !/implement(ed|es|ing)\s.*(#|http)/i.test(x)
      ) {
        r.push(/^(\*|-)\s+/.test(x) ? x.replace(/^(\*|-)\s+/, "") : x);
      }

      return r;
    }, []);
  return commit;
};

export function transformCommitsStringToObjects({
  intermediate,
}: SemanticsCtx) {
  const result = JSON.parse(intermediate.commitsSinceLatestVersionString);
  Log.success(
    `Commits found since latest version: ${Iro.green(result.length)}`,
  );
  return {
    ...intermediate,
    commitsSinceLatestVersion: result
      .map(normalizeBody)
      .map(extractCommitTypes)
      .map(extractBreakingChanges)
      // TODO: Extract
      .map((commit: ICommit) => {
        const whitelistedType = intermediate.commitTypesIncludedInTagMessage.find(
          (c) => c.type === commit.type,
        );

        if (!whitelistedType) {
          return commit;
        }

        if (whitelistedType.bumps === "patch") {
          commit.hasPatchUpdate = true;
        } else if (whitelistedType.bumps === "minor") {
          commit.hasMinorUpdate = true;
        }

        if (
          commit.breakingChanges.length ||
          whitelistedType.bumps === "major"
        ) {
          commit.hasMajorUpdate = true;
        }

        return commit;
      }),
  };
}

export const NormalizeCommits = IntermediatePipeline.of(
  normalizeCommitsString,
).concat(IntermediatePipeline.of(transformCommitsStringToObjects));
