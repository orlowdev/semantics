import { CommitTypes } from '../types/commit-types';
import { getFeatures } from './get-features';

export const buildChangelog = (
  version: string,
  features: string[],
  fixes: string[],
  chores: string[],
  reverts: string[],
  breakingChanges: string[]
): string => `# ${version}
${features.length ? `## ${CommitTypes.feat.title}

> ${CommitTypes.feat.description}

${features.map((f: string) => `* ${f}`).join('\n')}` : ''}
${fixes.length ? `## ${CommitTypes.fix.title}

> ${CommitTypes.fix.description}

${fixes.map((f: string) => `* ${f}`).join('\n')}` : ''}
${chores.length ? `## ${CommitTypes.chore.title}

> ${CommitTypes.chore.description}

${chores.map((f: string) => `* ${f}`).join('\n')}` : ''}
${reverts.length ? `## ${CommitTypes.revert.title}

> ${CommitTypes.revert.description}

${reverts.map((f: string) => `* ${f}`).join('\n')}` : ''}
${breakingChanges.length ? `## BREAKING CHANGES

> Something backwards-incompatible

${breakingChanges.map((f: string) => `* ${f}`).join('\n')}` : ''}`;
