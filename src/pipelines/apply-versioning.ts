import { IntermediatePipeline } from "@priestine/pipeline";
import { SemanticsCtx } from "../interfaces/semantics-intermediate.interface";
import { Log } from "../utils/log.util";
import { ICommit } from "../interfaces/commit.interface";
import * as R from "ramda";
import { Iro } from "@priestine/iro/src";
import { ICommitType } from "../interfaces/commit-type.interface";
import { getSubjects } from "../utils/get-subjects.util";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { execPromise } from "../utils/exec-promise.util";

export function reverseCommitsArrayIfRequired({ intermediate }: SemanticsCtx) {
  if (intermediate.oldestCommitsFirst) {
    Log.info("Commits will be put oldest to newest.");
  }

  return {
    ...intermediate,
    commitsSinceLatestVersion: intermediate.oldestCommitsFirst
      ? intermediate.commitsSinceLatestVersion.reverse()
      : intermediate.commitsSinceLatestVersion,
  };
}

export function getBreakingChanges(changes: ICommit[]): string {
  let substring: string = "";

  const bc = R.flatten(
    changes.map((x: ICommit) =>
      x.breakingChanges.map(
        (y: string) => `* ${x.scope ? x.scope : " "}${y} ${x.abbrevHash}`,
      ),
    ),
  );

  if (bc && bc.length) {
    Log.success(
      `Adding ${Iro.green(
        Iro.bold(`${bc.length} breaking change`),
      )} entries to the changelog`,
    );

    substring += `\n\n## BREAKING CHANGES\n`;

    substring += bc.join("\n");
  }

  return substring;
}

export function getChangelog(
  changes: ICommit[],
  types: ICommitType[],
  omittedTypes: string[],
): string {
  const getSubjectedCommits = getSubjects(changes);

  omittedTypes.forEach((ct: string) => {
    const commitsOfThatType = changes.filter((change) => change.type === ct);

    const mentionedTwiceIndex = types.findIndex((t) => t.type === ct);

    if (~mentionedTwiceIndex) {
      Log.warning(
        `Commit type ${Iro.bold(
          Iro.yellow(ct),
        )} was mentioned in both whitelist and blacklist.`,
      );
      Log.warning(
        `Removing ${Iro.bold(
          Iro.yellow(ct),
        )} from whitelist as blacklist takes precedence.`,
      );
      Log.warning(
        "Note that given commit type will not bump the version as it is blacklisted.",
      );
      types.splice(mentionedTwiceIndex, 1);
    }

    if (commitsOfThatType.length) {
      Log.info(
        `Skipping ${Iro.cyan(Iro.bold(`${commitsOfThatType.length} ${ct}`))} ${
          commitsOfThatType.length === 1 ? "commit" : "commits"
        }`,
      );
    }
  });

  return types
    .map((ct: ICommitType) => {
      let substring: string = "";

      const commitsOfThatType = changes.filter(
        (change) => change.type === ct.type,
      );

      if (commitsOfThatType.length) {
        Log.success(
          `Adding ${Iro.green(
            Iro.bold(`${commitsOfThatType.length} ${ct.type}`),
          )} ${
            commitsOfThatType.length === 1 ? "commit" : "commits"
          } to the changelog`,
        );
      }

      const subjects = getSubjectedCommits(ct.type);

      if (subjects && subjects.length) {
        substring += `\n\n## ${ct.title}\n`;

        substring += "\n";
        substring += getSubjectedCommits(ct.type)
          .map((x: string) => `* ${x}`)
          .join("\n");
      }

      return substring;
    })
    .join("");
}

export function buildTagMessageIfRequired({ intermediate }: SemanticsCtx) {
  Log.info("Building changelog...");

  intermediate.tagMessageContents = `# ${intermediate.newVersion}`
    .concat(
      getChangelog(
        intermediate.commitsSinceLatestVersion,
        intermediate.commitTypesIncludedInTagMessage,
        intermediate.commitTypesExcludedFromTagMessage,
      ),
    )
    .concat(getBreakingChanges(intermediate.commitsSinceLatestVersion));

  return intermediate;
}

export function writeTemporaryFilesIfRequired({ intermediate }: SemanticsCtx) {
  if (!intermediate.writeTemporaryFiles) {
    return intermediate;
  }

  const writeFile = (path, content) => writeFileSync(path, content, "utf8");

  Log.info("Writing to temporary files...");

  try {
    writeFile(".tmp.current_tag_data", intermediate.latestVersionTag || "");
    writeFile(".tmp.current_commit_data", intermediate.currentCommitHash);
    writeFile(
      ".tmp.current_changes.json",
      JSON.stringify(intermediate.commitsSinceLatestVersion, null, 2),
    );
    writeFile(".tmp.version_data", intermediate.newVersion);
    writeFile(".tmp.changelog.md", intermediate.tagMessageContents);

    Log.success("Temporary files successfully created");
  } catch (e) {
    Log.error(`Could not write temporary files: ${e.message}`);
  }

  return intermediate;
}

export function publishTagIfRequired({ intermediate }: SemanticsCtx) {
  if (!intermediate.publishTag) {
    Log.info("Skipping publishing newly created tag...");

    return intermediate;
  }

  const gitUser = intermediate.gitUserName
    ? intermediate.gitUserName
    : intermediate.user;

  execSync(`git config user.name ${gitUser}`);

  if (intermediate.gitUserEmail) {
    execSync(`git config user.email ${intermediate.gitUserEmail}`);
  }

  const origin = intermediate.origin
    ? intermediate.origin
    : execSync("git config --get remote.origin.url", { encoding: "utf8" });

  let branch = execSync("git rev-parse --abbrev-ref HEAD", {
    encoding: "utf8",
  });
  if (/HEAD/.test("HEAD")) {
    branch = execSync("git name-rev HEAD", { encoding: "utf8" }).replace(
      /HEAD\s+/,
      "",
    );
    Log.info(`The HEAD is detached. Current branch is ${branch}.`);
  }

  if (!origin.includes("@")) {
    if (!intermediate.password) {
      Log.error("Private token not specified");
      process.exit(1);
    }

    const accessibleRemote = origin.replace(
      "https://",
      `https://${intermediate.user}:${intermediate.password}@`,
    );
    Log.info("Setting new remote origin...");
    execSync(`git remote set-url origin ${accessibleRemote}`);
  }

  execPromise(
    `git tag -am "${intermediate.tagMessageContents}" ${
      intermediate.newVersion
    }`,
  )
    .then(() => {
      if (intermediate.writeToChangelog) {
        if (!existsSync("./CHANGELOG.md")) {
          Log.warning("CHANGELOG.md is not in place. Creating the file.");
          writeFileSync("./CHANGELOG.md", "", "utf8");
        }

        const changelog = readFileSync("./CHANGELOG.md", "utf8");
        writeFileSync(
          "./CHANGELOG.md",
          intermediate.tagMessageContents.concat("\n").concat(changelog),
        );
        execSync("git add ./CHANGELOG.md");
        execSync(
          `git commit -m "docs(changelog): add ${
            intermediate.newVersion
          } changes"`,
        );
        execSync(`git push origin ${branch}`);
      }

      return execPromise(`git push origin ${intermediate.newVersion}`);
    })
    .catch(Log.info)
    .then(() =>
      Log.success(
        `Version ${Iro.bold(
          Iro.green(intermediate.newVersion),
        )} successfully released! 🙌`,
      ),
    )
    .catch(Log.info);
}

export const ApplyVersioning = IntermediatePipeline.from([
  reverseCommitsArrayIfRequired,
  buildTagMessageIfRequired,
  writeTemporaryFilesIfRequired,
  publishTagIfRequired,
]);
