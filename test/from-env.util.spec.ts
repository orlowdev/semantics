import { fromEnv } from '../src/utils/from-env.util';

describe('fromEnv', () => {
  const getFromEnv = fromEnv({
    SUCCESS: 'true',
    FAILURE: 'false',
    NUMBER: '123',
    MULTI_WORD_VALUE: 'yes',
  });

  it('should extract value from the environment object provided as an argument', () => {
    expect(getFromEnv('SUCCESS', 'false')).toEqual('true');
  });

  it('should apply default value if the environment object does not have provided key', () => {
    expect(getFromEnv('NON_EXISTENT', 'still found')).toEqual('still found');
  });

  it('should apply default to empty string if default value was not provided', () => {
    expect(getFromEnv('NON_EXISTENT')).toEqual('');
  });

  it('should apply given transformer on the returned value', () => {
    expect(getFromEnv('NUMBER', '456', Number)).toEqual(123);
  });

  it('should return default value if environment object was not provided', () => {
    expect(fromEnv(null as any)('123', '456')).toEqual('456');
  });
});