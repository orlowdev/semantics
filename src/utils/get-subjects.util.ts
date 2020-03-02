import { CommitInterface } from "../interfaces/commit.interface";

/**
 * Extract commit subjects and transform them into readable form.
 * @param xs CommitInterface[]
 * @returns string[]
 */
export const getSubjects = (xs: CommitInterface[]) => (
  type: string,
): string[] =>
  xs
    .filter((x: CommitInterface) => x.type === type)
    .map(
      (x: CommitInterface) =>
        `${x.scope ? `${x.scope} ` : ""}${x.description} ${x.abbrevHash}${
          x.body.length ? `\n\n  * ${x.body.join("<br/>\n  * ")}\n` : ""
        }`,
    );
