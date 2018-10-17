import { CommitTypes } from '../types/commit-types';

/**
 * Build new tag release changelog based on given changes and their types.
 * @todo:priestine - Refactor this
 * @param version string
 * @param features string[]
 * @param fixes string[]
 * @param chores string[]
 * @param reverts string[]
 * @param tests string[]
 * @param refactors string[]
 * @param perfs string[]
 * @param builds string[]
 * @param cis string[]
 * @param docs string[]
 * @param styles string[]
 * @param breakingChanges string[]
 */
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
  docs: string[],
  styles: string[],
  breakingChanges: string[]
): string =>
  `# ${version}
${
    features.length
      ? `
## ${CommitTypes.feat.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.feat.description}\`
`}
${features.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    fixes.length
      ? `

## ${CommitTypes.fix.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.fix.description}\`
`}
${fixes.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    docs.length
      ? `

## ${CommitTypes.docs.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.docs.description}\`
`}
${docs.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    styles.length
      ? `

## ${CommitTypes.style.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.style.description}\`
`}
${styles.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    refactors.length
      ? `

## ${CommitTypes.refactor.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.refactor.description}\`
`}
${refactors.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    perfs.length
      ? `

## ${CommitTypes.perf.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.perf.description}\`
`}
${perfs.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    tests.length
      ? `
## ${CommitTypes.test.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.test.description}\`
`}
${tests.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    builds.length
      ? `

## ${CommitTypes.build.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.build.description}\`
`}
${builds.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    cis.length
      ? `

## ${CommitTypes.ci.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.ci.description}\`
`}
${cis.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    chores.length
      ? `

## ${CommitTypes.chore.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.chore.description}\`
`}
${chores.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    reverts.length
      ? `

## ${CommitTypes.revert.title}
${process.argv.includes('--no-helpers') ? '' : `
\`${CommitTypes.revert.description}\`
`}
${reverts.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }${
    breakingChanges.length
      ? `

## BREAKING CHANGES
${process.argv.includes('--no-helpers' ? '' : `
\`All things backwards-incompatible\`
`)}
${breakingChanges.map((f: string) => `* ${f}`).join('\n')}`
      : ''
  }`.trim();
