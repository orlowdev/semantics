import { fromArgv } from '../src/utils/from-argv.util';

describe('fromArgv', () => {
  const getFromArgv = fromArgv([
    'success=true',
    'number=123',
    'flag'
  ]);

  it('should extract value from argv provided as an argument', () => {
    expect(getFromArgv('success', 'false')).toEqual('true');
  });

  it('should apply default value if argv does not have provided key', () => {
    expect(getFromArgv('non-existent', 'still found')).toEqual('still found');
  });

  it('should apply default to empty string if default value was not provided', () => {
    expect(getFromArgv('non-existent')).toEqual('');
  });

  it('should apply given transformer on the returned value', () => {
    expect(getFromArgv('number', '456', Number)).toEqual(123);
  });

  it('should set value to true if it was not provided', () => {
    expect(getFromArgv('flag')).toEqual('true');
  });

  it('should return default value if argv was not provided', () => {
    expect(fromArgv(null as any)('123', '456')).toEqual('456');
  });
});