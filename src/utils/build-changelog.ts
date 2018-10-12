import { CommitTypes } from '../types/commit-types';

export const buildChangelog = (
  version: string,
  features: string[],
  fixes: string[],
  chores: string[],
  reverts: string[],
  tests: string[],
  refactors: string[],
  perfs: string[],
  builds: string[],
  cis: string[],
  breakingChanges: string[]
): string => `# ${version}
${features.length ? `
## ${CommitTypes.feat.title}

> ${CommitTypes.feat.description}

${features.map((f: string) => `* ${f}`).join('\n')}` : ''}${fixes.length ? `

## ${CommitTypes.fix.title}

> ${CommitTypes.fix.description}

${fixes.map((f: string) => `* ${f}`).join('\n')}` : ''}${refactors.length ? `

## ${CommitTypes.refactor.title}

> ${CommitTypes.refactor.description}

${refactors.map((f: string) => `* ${f}`).join('\n')}` : ''}${perfs.length ? `

## ${CommitTypes.perf.title}

> ${CommitTypes.perf.description}

${perfs.map((f: string) => `* ${f}`).join('\n')}` : ''}${tests.length ? `
## ${CommitTypes.test.title}

> ${CommitTypes.test.description}

${tests.map((f: string) => `* ${f}`).join('\n')}` : ''}${builds.length ? `

## ${CommitTypes.build.title}

> ${CommitTypes.build.description}

${builds.map((f: string) => `* ${f}`).join('\n')}` : ''}${cis.length ? `

## ${CommitTypes.ci.title}

> ${CommitTypes.ci.description}

${cis.map((f: string) => `* ${f}`).join('\n')}` : ''}${chores.length ? `

## ${CommitTypes.chore.title}

> ${CommitTypes.chore.description}

${chores.map((f: string) => `* ${f}`).join('\n')}` : ''}${reverts.length ? `

## ${CommitTypes.revert.title}

> ${CommitTypes.revert.description}

${reverts.map((f: string) => `* ${f}`).join('\n')}` : ''}${breakingChanges.length ? `

## BREAKING CHANGES

> Something backwards-incompatible

${breakingChanges.map((f: string) => `* ${f}`).join('\n')}` : ''}`.trim();
