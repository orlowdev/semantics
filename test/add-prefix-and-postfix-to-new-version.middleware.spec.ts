import { addPrefixAndPostfixToNewVersion } from '../src/middleware/add-prefix-and-postfix-to-new-version.middleware';
import { SemanticsCtx } from '../src/interfaces/semantics-intermediate.interface';

describe('addPrefixAndPostfixToNewVersion', () => {
  it('should add prefix and postfix to the new version value', () => {
    expect(
      addPrefixAndPostfixToNewVersion({
        intermediate: {
          prefix: 'v',
          postfix: '-beta.0',
          newVersion: '1.0.0',
        },
      } as SemanticsCtx).newVersion
    ).toEqual('v1.0.0-beta.0');
  });
});
