import { SemanticsCtx } from '../interfaces/semantics-intermediate.interface';

export function addPrefixAndPostfixToNewVersion({ intermediate }: SemanticsCtx) {
  return {
    ...intermediate,
    newVersion: `${intermediate.prefix}${intermediate.newVersion}${intermediate.postfix}`,
  };
}
