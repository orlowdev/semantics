import { expect } from 'chai';
import { extractCommitTypes } from './extract-commit-types';

describe('extractCommitTypes', () => {
  it('should assign fix type if commit is non-conventional', () => {
    expect(extractCommitTypes({ subject: 'test' } as any).type).to.equal('fix');
  });

  it('should mark issue reference if commit scope includes a #', () => {
    expect(extractCommitTypes({ subject: 'chore(#1): test' } as any).issueReference).to.equal('#1');
  });

  it('should extract scope from commit type', () => {
    expect(extractCommitTypes({ subject: 'chore(#1): test' } as any).type).to.equal('chore');
    expect(extractCommitTypes({ subject: 'fix(html): test' } as any).type).to.equal('fix');
  });

  it('should put commit scope inside commit subject if it is not an issue reference', () => {
    expect(extractCommitTypes({ subject: 'chore(#1): test' } as any).subject).to.equal('test');
    expect(extractCommitTypes({ subject: 'fix(html): test' } as any).subject).to.equal('(html) test');
  });

  it('should not extract issue references if --no-flexible-scope flag is provided', () => {
    process.argv.unshift('--no-flexible-scope');
    expect(extractCommitTypes({ subject: 'chore(#1): test' } as any).subject).to.equal('(#1) test');
  });
});
