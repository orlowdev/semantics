#!/usr/bin/env node

import { MiddlewareContextInterface, Pipeline } from '@priestine/data';
import { exec, ExecException } from 'child_process';
import * as request from 'request';
import { writeFileSync } from 'fs';
import { Iro } from '@priestine/iro';
import * as R from 'ramda';
import { transformCase } from './utils/case-transformer.util';
import ProcessEnv = NodeJS.ProcessEnv;
import { Log } from './utils/messenger.util';

export interface CommitTypeInterface {
  title: string;
  type: string;
  bumps?: 'patch' | 'minor' | 'major';
}

export const getBreakingChanges = (changes: CommitInterface[]): string => {
  let substring: string = '';

  const bc = R.flatten(
    changes.map((x: CommitInterface) =>
      x.breakingChanges.map((y: string) => `* ${x.scope ? x.scope : ' '}${y} ${x.abbrevHash}`)
    )
  );

  if (bc && bc.length) {
    Log.success(`Adding ${Iro.green(Iro.bold(`${bc.length} breaking change`))} entries to the changelog`);

    substring += `\n\n## BREAKING CHANGES\n`;

    substring += bc.join('\n');
  }

  return substring;
};

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
          x.body.length ? `\n\n> ${x.body.join('<br/>\n> ')}\n` : ''
        }`
    );

export const getChangelog = (
  changes: CommitInterface[],
  types: CommitTypeInterface[],
  omittedTypes: string[]
): string => {
  const getSubjectedCommits = getSubjects(changes);

  omittedTypes.forEach((ct: string) => {
    const commitsOfThatType = changes.filter((change) => change.type === ct);

    const mentionedTwiceIndex = types.findIndex((t) => t.type === ct);

    if (~mentionedTwiceIndex) {
      Log.warning(`Commit type ${Iro.bold(Iro.yellow(ct))} was mentioned in both whitelist and blacklist.`);
      Log.warning(`Removing ${Iro.bold(Iro.yellow(ct))} from whitelist as blacklist takes precedence.`);
      Log.warning('Note that given commit type will not bump the version as it is blacklisted.');
      types.splice(mentionedTwiceIndex, 1);
    }

    if (commitsOfThatType.length) {
      Log.info(
        `Skipping ${Iro.cyan(Iro.bold(`${commitsOfThatType.length} ${ct}`))} ${
          commitsOfThatType.length === 1 ? 'commit' : 'commits'
        }`
      );
    }
  });

  return types
    .map((ct: CommitTypeInterface) => {
      let substring: string = '';

      const commitsOfThatType = changes.filter((change) => change.type === ct.type);

      if (commitsOfThatType.length) {
        Log.success(
          `Adding ${Iro.green(Iro.bold(`${commitsOfThatType.length} ${ct.type}`))} ${
            commitsOfThatType.length === 1 ? 'commit' : 'commits'
          } to the changelog`
        );
      }

      const subjects = getSubjectedCommits(ct.type);

      if (subjects && subjects.length) {
        substring += `\n\n## ${ct.title}\n`;

        substring += '\n';
        substring += getSubjectedCommits(ct.type)
          .map((x: string) => `* ${x}`)
          .join('\n');
      }

      return substring;
    })
    .join('');
};

/**
 * Parse integer from given string containing a number. If the string has no number, 0 will be returned.
 * @param x String containing a number.
 * @returns number
 */
export const parseInteger = (x: string): number => (x ? (/\d+/.test(x) ? Number.parseInt(x, 10) : 0) : 0);

/**
 * Get tag string and return a tuple with three numbers.
 * @param currentTag String representing current git tag
 * @returns [number, number, number]
 */
export const getCurrentVersion = (currentTag: string): [number, number, number] => {
  if (!currentTag) {
    return [0, 0, 0];
  }

  const currentVersion = currentTag.match(/(\d+).(\d+).(\d+)/);

  if (!currentVersion || !currentVersion[1]) {
    return [0, 0, 0];
  }

  return [parseInteger(currentVersion[1]), parseInteger(currentVersion[2]), parseInteger(currentVersion[3])];
};

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

export interface Config {
  /**
   * @default github
   */
  repository: 'github' | 'gitlab';

  privateToken: string;

  projectPath: string;

  /**
   * @default true
   */
  publishTag: boolean;

  /**
   * @default false
   */
  createTemporaryFiles: boolean;

  /**
   * @default true
   */
  oldestCommitsFirst: boolean;

  /**
   * @default false
   */
  displayAuthor: boolean;

  /**
   * @default includes fix and feat types
   */
  commitTypesIncludedInTagMessage: CommitTypeInterface[];

  /**
   * @default []
   */
  commitTypesExcludedFromTagMessage: string[];

  /**
   * @default true
   */
  tagMessage: boolean;

  /**
   * @default ""
   */
  prefix: string;

  /**
   * @default ""
   */
  postfix: string;

  /**
   * @default "./"
   */
  configFilePath: string;

  /**
   * @default false
   */
  writeTemporaryFiles: boolean;

  /**
   * @default true
   */
  preciseVersionMatching: boolean;
}

export function setUpDefaultConfig(): Partial<SemanticsIntermediate> {
  Log.info('Setting up configuration...');

  return {
    repository: 'github',
    publishTag: true,
    createTemporaryFiles: false,
    oldestCommitsFirst: true,
    displayAuthor: false,
    commitTypesIncludedInTagMessage: [
      {
        type: 'fix',
        title: 'Bug fixes',
        bumps: 'patch',
      },
      {
        type: 'feat',
        title: 'New features',
        bumps: 'minor',
      },
    ],
    commitTypesExcludedFromTagMessage: [],
    tagMessage: true,
    prefix: '',
    postfix: '',
    configFilePath: '',
    writeTemporaryFiles: false,
    preciseVersionMatching: true,
    privateToken: '',
    projectPath: '',
  };
}

export interface CommitInterface {
  hash: string;
  abbrevHash: string;
  author: {
    name: string;
    email: string;
  };
  description: string;
  body: string[];
  footer: string[];
  type: string;
  hasPatchUpdate: boolean;
  hasMinorUpdate: boolean;
  hasMajorUpdate: boolean;
  scope?: string;
  breakingChanges: string[];
}

export function fromEnv(env: ProcessEnv) {
  return (key: string, defaultVal = '', transformer = (x) => x): string => {
    if (!env) {
      return defaultVal;
    }

    return transformer(env[key]) || defaultVal;
  };
}

export function fromArgv(argv: string[]) {
  const args = argv.reduce((acc, arg) => {
    const [key, value] = arg.split('=');
    acc[key] = value;
    return acc;
  }, {});
  return (key: string, defaultVal = '', transformer = (x) => x): string => {
    if (!argv) {
      return defaultVal;
    }

    return transformer(args[key]) || defaultVal;
  };
}

export function updateConfigFromArgv(argv: string[]) {
  return ({ intermediate }: SemanticsCtx) => {
    Object.keys(intermediate).forEach((key) => {
      const argvKey = `--${transformCase(key).from.camel.to.kebab.toString()}`;
      const getFromArgv = fromArgv(argv.filter((arg) => /^--.*=/.test(arg)));

      if (typeof intermediate[key] === 'number') {
        intermediate[key] = Number.isInteger(intermediate[key])
          ? Number.parseInt(getFromArgv(argvKey, intermediate[key]))
          : Number.parseFloat(getFromArgv(argvKey, intermediate[key]));
      } else if (typeof intermediate[key] === 'boolean') {
        intermediate[key] = getFromArgv(argvKey, String(intermediate[key])) === 'true';
      } else {
        intermediate[key] = getFromArgv(argvKey, intermediate[key]);
      }
    });
  };
}

export function updateConfigFromEnv(env: ProcessEnv) {
  return ({ intermediate }: SemanticsCtx) => {
    Object.keys(intermediate).forEach((key) => {
      const envKey = transformCase(key)
        .from.camel.to.snake.toString()
        .toUpperCase();
      const getFromEnv = fromEnv(env);

      if (typeof intermediate[key] === 'number') {
        intermediate[key] = Number.isInteger(intermediate[key])
          ? Number.parseInt(getFromEnv(envKey, intermediate[key]))
          : Number.parseFloat(getFromEnv(envKey, intermediate[key]));
      } else if (typeof intermediate[key] === 'boolean') {
        intermediate[key] = getFromEnv(envKey, String(intermediate[key])) === 'true';
      } else {
        intermediate[key] = getFromEnv(envKey, intermediate[key]);
      }
    });

    return intermediate;
  };
}

export type SemanticsCtx = MiddlewareContextInterface<SemanticsIntermediate>;

export interface SemanticsIntermediate extends Config {
  currentCommitHash: string;
  latestVersionTag: string;
  latestVersionCommitHash: string;
  commitsSinceLatestVersion: string | CommitInterface[];
  versionTuple: [number, number, number];
  newVersion: string;
  tagMessageContents: string;
}

/**
 * Execute command in a Promise.
 * @param cmd Command to be executed.
 * @returns Promise<string>
 */
export const execPromise = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (e: ExecException, stdout: string, stderr: string) => {
      if (e) return reject(e.message.replace(/\n$/, ''));
      if (stderr) return reject(stderr.replace(/\n$/, ''));
      resolve(stdout.replace(/\n$/, ''));
    });
  });
};

export function getCurrentCommitHash({ intermediate }: SemanticsCtx) {
  return execPromise('git rev-parse HEAD')
    .then((currentCommitHash) => {
      Log.success(`Current commit hash: ${Iro.green(currentCommitHash)}`);

      return {
        ...intermediate,
        currentCommitHash,
      };
    })
    .catch((e) => {
      Log.error(e.replace('\n', '->'));
      process.exit(1);
    });
}

export function getLatestVersionTag({ intermediate }: SemanticsCtx) {
  const matcher = intermediate.preciseVersionMatching ? `${intermediate.prefix}*${intermediate.postfix}` : `*`;

  return execPromise(`git describe --match "${matcher}" --abbrev=0 HEAD --tags`)
    .then((latestVersionTag) => {
      Log.success(`Latest version tag: ${Iro.green(latestVersionTag)}`);

      return {
        ...intermediate,
        latestVersionTag,
      };
    })
    .catch((e) => {
      if (!/\nfatal: No names found, cannot describe anything/.test(e)) {
        Log.error(e.replace('\n', '->'));
        process.exit(1);
      }

      Log.warning(
        `There are no previous tags matching the "${Iro.yellow(
          `${intermediate.prefix}*${intermediate.postfix}`
        )}" pattern.`
      );
      Log.warning(`Initial commit hash will be considered the latest version.`);

      return {
        ...intermediate,
        latestVersionTag: undefined,
      };
    });
}

/**
 * Git commit format template.
 */
export const commitFormat: string =
  '{' +
  '^^^hash^^^: ^^^%H^^^,' +
  '^^^abbrevHash^^^: ^^^%h^^^,' +
  '^^^author^^^: {' +
  '^^^name^^^: ^^^%aN^^^,' +
  '^^^email^^^: ^^^%aE^^^' +
  '},' +
  '^^^description^^^: ^^^%s^^^,' +
  '^^^body^^^: ^^^%b^^^' +
  '}';

export function getLatestVersionCommitHash({ intermediate }: SemanticsCtx) {
  return (intermediate.latestVersionTag
    ? execPromise(`git show-ref ${intermediate.latestVersionTag} -s`)
    : execPromise('git rev-list HEAD | tail -n 1')
  ).then((latestVersionCommitHash) => {
    Log.success(`Commit hash of latest version: ${Iro.green(latestVersionCommitHash)}`);

    return {
      ...intermediate,
      latestVersionCommitHash,
    };
  });
}

export function getCommitsSinceLatestVersion({ intermediate }: SemanticsCtx) {
  return execPromise(
    `git rev-list ${intermediate.latestVersionCommitHash}..${
      intermediate.currentCommitHash
    } --no-merges --format='${commitFormat}'`
  )
    .then((commitsSinceLatestVersion) => ({
      ...intermediate,
      commitsSinceLatestVersion,
    }))
    .catch((e) => {
      Log.error(e.replace('\n', '->'));
      process.exit(1);
    });
}

export function formatCommitsStringToValidJSON({ intermediate }: SemanticsCtx) {
  return {
    ...intermediate,
    commitsSinceLatestVersion: `[ ${(intermediate.commitsSinceLatestVersion as string)
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

export function transformCommitsStringToCommitObjects({ intermediate }: SemanticsCtx) {
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

export function reverseCommitsArrayIfRequired({ intermediate }: SemanticsCtx) {
  if (intermediate.oldestCommitsFirst) {
    Log.info('Commits will be put oldest to newest.');
  }

  return {
    ...intermediate,
    commitsSinceLatestVersion: intermediate.oldestCommitsFirst
      ? (intermediate.commitsSinceLatestVersion as CommitInterface[]).reverse()
      : intermediate.commitsSinceLatestVersion,
  };
}

export function getVersionTuple({ intermediate }: SemanticsCtx) {
  return {
    ...intermediate,
    versionTuple: getCurrentVersion(intermediate.latestVersionTag),
  };
}

export function bumpPatchVersion({ intermediate }: SemanticsCtx) {
  const currentVersionTuple = intermediate.versionTuple;

  if ((intermediate.commitsSinceLatestVersion as CommitInterface[]).some((commit) => commit.hasPatchUpdate)) {
    intermediate.newVersion = `${currentVersionTuple[0]}.${currentVersionTuple[1]}.${currentVersionTuple[2] + 1}`;
  }

  return intermediate;
}

export function bumpMinorVersion({ intermediate }: SemanticsCtx) {
  const currentVersionTuple = intermediate.versionTuple;

  if ((intermediate.commitsSinceLatestVersion as CommitInterface[]).some((commit) => commit.hasMinorUpdate)) {
    intermediate.newVersion = `${currentVersionTuple[0]}.${currentVersionTuple[1] + 1}.0`;
  }

  return intermediate;
}

export function bumpMajorVersion({ intermediate }: SemanticsCtx) {
  const currentVersionTuple = intermediate.versionTuple;

  if (
    (intermediate.commitsSinceLatestVersion as CommitInterface[]).some((commit) => commit.hasMajorUpdate) ||
    !intermediate.newVersion
  ) {
    intermediate.newVersion = `${currentVersionTuple[0] + 1}.0.0`;
  }

  return intermediate;
}

export function addPrefixAndPostfixToNewVersion({ intermediate }: SemanticsCtx) {
  return {
    ...intermediate,
    newVersion: `${intermediate.prefix}${intermediate.newVersion}${intermediate.postfix}`,
  };
}

export function exitIfVersionIsNotUpdated({ intermediate }: SemanticsCtx) {
  if (intermediate.latestVersionTag === intermediate.newVersion) {
    Log.warning('Evaluated changes do not require version bumping. Terminating.');
    return process.exit(0);
  }

  Log.success(`New version candidate: ${Iro.green(`${intermediate.newVersion}`)}`);

  return intermediate;
}

export function buildTagMessageIfRequired({ intermediate }: SemanticsCtx) {
  if (intermediate.tagMessage) {
    Log.info('Building changelog...');

    intermediate.tagMessageContents = `# ${intermediate.newVersion}`
      .concat(
        getChangelog(
          intermediate.commitsSinceLatestVersion as CommitInterface[],
          intermediate.commitTypesIncludedInTagMessage,
          intermediate.commitTypesExcludedFromTagMessage
        )
      )
      .concat(getBreakingChanges(intermediate.commitsSinceLatestVersion as CommitInterface[]));
  }

  return intermediate;
}

export function exitIfThereAreNoNewCommits({ intermediate }: SemanticsCtx) {
  if (!intermediate.commitsSinceLatestVersion.length) {
    Log.warning('There are no changes since last release. Terminating.');
    process.exit(0);
  }

  return intermediate;
}

export function writeTemporaryFilesIfRequired({ intermediate }: SemanticsCtx) {
  if (!intermediate.writeTemporaryFiles) {
    return intermediate;
  }

  const writeFile = (path, content) => writeFileSync(path, content, 'utf8');

  Log.info('Writing to temporary files...');

  try {
    writeFile('.tmp.current_tag_data', intermediate.latestVersionTag || '');
    writeFile('.tmp.current_commit_data', intermediate.currentCommitHash);
    writeFile('.tmp.current_changes.json', JSON.stringify(intermediate.commitsSinceLatestVersion, null, 2));
    writeFile('.tmp.version_data', intermediate.newVersion);
    writeFile('.tmp.changelog.md', intermediate.tagMessageContents);

    Log.success('Temporary files successfully created');
  } catch (e) {
    Log.error(`Could not write temporary files: ${e.message}`);
  }

  return intermediate;
}

export function publishTagIfRequired({ intermediate }: SemanticsCtx) {
  if (!intermediate.publishTag) {
    Log.info('Skipping publishing newly created tag...');

    return intermediate;
  }

  if (!intermediate.privateToken) {
    Log.error('Private token not specified');
    process.exit(1);
  }

  if (!intermediate.projectPath) {
    Log.error('Project path not provided');
    process.exit(1);
  }

  if (intermediate.repository === 'gitlab') {
    request.post(
      `https://gitlab.com/api/v4/projects/${intermediate.projectPath}/repository/tags`,
      {
        headers: {
          'PRIVATE-TOKEN': intermediate.privateToken,
        },
        json: true,
        body: {
          id: intermediate.projectPath.replace(/\\/g, '%2F'),
          tag_name: intermediate.newVersion,
          ref: intermediate.currentCommitHash,
          release_description: intermediate.tagMessageContents,
        },
      },
      (e: Error, r, b) => {
        if (e) {
          Log.error(e.message);
          return;
        }

        if (b.error) {
          Log.error(`Server responded with error: ${Iro.red(b.error)}`);
          return;
        }

        Log.success(`Version ${Iro.bold(Iro.green(intermediate.newVersion))} successfully released! 🙌`);
      }
    );
  } else {
    request.post(
      `https://api.github.com/repos/${intermediate.projectPath}/releases`,
      {
        headers: {
          Authorization: `token ${intermediate.privateToken}`,
          'User-Agent': 'Priestine-Semantics',
        },
        json: true,
        body: {
          tag_name: intermediate.newVersion,
          name: intermediate.newVersion,
          body: intermediate.tagMessageContents,
        },
      },
      (e: Error, r, b) => {
        if (e) {
          Log.error(e.message);
          return;
        }

        console.log(b);

        if (b.error) {
          Log.error(`Server responded with error: ${Iro.red(b.error)}`);
          return;
        }

        Log.success(`Version ${Iro.bold(Iro.green(intermediate.newVersion))} successfully released! 🙌`);
      }
    );
  }
}

Pipeline.from([
  setUpDefaultConfig,
  updateConfigFromArgv(process.argv.slice(2)),
  updateConfigFromEnv(process.env),
  getCurrentCommitHash,
  getLatestVersionTag,
  getLatestVersionCommitHash,
  getCommitsSinceLatestVersion,
  formatCommitsStringToValidJSON,
  transformCommitsStringToCommitObjects,
  exitIfThereAreNoNewCommits,
  reverseCommitsArrayIfRequired,
  getVersionTuple,
  bumpPatchVersion,
  bumpMinorVersion,
  bumpMajorVersion,
  addPrefixAndPostfixToNewVersion,
  exitIfVersionIsNotUpdated,
  buildTagMessageIfRequired,
  writeTemporaryFilesIfRequired,
  publishTagIfRequired,
  // TODO: Remove ambiguity of using the same key for values of different types (no-as)
  // TODO: Refer to supported types from config array instead of hardcoded object
  // TODO: Display "skipping" message only if there are commits of the type and the type is blacklisted
  // TODO: Display "Adding" message only if there are commits of the type and the type is whitelisted
  // TODO: Fix color mismatching before and after applying different color inside a string
])
  .process({
    intermediate: {} as SemanticsIntermediate,
  })
  .catch((e) => {
    Log.error(e.replace('\n', '->'));
    process.exit(1);
  });
