import { ICommit } from "../interfaces/commit.interface";

/**
 * Extract commit subjects and transform them into readable form.
 * @param xs ICommit[]
 * @returns string[]
 */
export const getSubjects = (xs: ICommit[]) => (type: string): string[] =>
  xs
    .filter((x: ICommit) => x.type === type)
    .map(
      (x: ICommit) =>
        `${x.scope ? `${x.scope} ` : ""}${x.description} ${x.abbrevHash}${
          x.body.length ? `\n\n  * ${x.body.join("<br/>\n  * ")}\n` : ""
        }`,
    );
