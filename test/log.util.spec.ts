import { Log } from '../src/utils/log.util';
import { Iro } from '@priestine/iro/src';

describe('Log', () => {
  it('should result into properly applied output stings', () => {
    const mockLog = jest.spyOn(Iro, 'log').mockImplementation((x) => x);

    Log.warning('123');
    expect(mockLog).toHaveBeenCalledWith(Iro.yellow(Iro.inverse(' SEMANTICS WARNING '), '  '), Iro.white('123'));
    Log.success('123');
    expect(mockLog).toHaveBeenCalledWith(Iro.green(Iro.inverse(' SEMANTICS SUCCESS '), '  '), Iro.white('123'));
    Log.error('123');
    expect(mockLog).toHaveBeenCalledWith(Iro.red(Iro.inverse(' SEMANTICS ERROR   '), '  '), Iro.white('123'));
    Log.info('123');
    expect(mockLog).toHaveBeenCalledWith(Iro.cyan(Iro.inverse(' SEMANTICS INFO    '), '  '), Iro.white('123'));
    Log.tapWarning('123')({} as any);
    expect(mockLog).toHaveBeenCalledWith(Iro.yellow(Iro.inverse(' SEMANTICS WARNING '), '  '), Iro.white('123'));
    Log.tapSuccess('123')({} as any);
    expect(mockLog).toHaveBeenCalledWith(Iro.green(Iro.inverse(' SEMANTICS SUCCESS '), '  '), Iro.white('123'));
    Log.tapError('123')({} as any);
    expect(mockLog).toHaveBeenCalledWith(Iro.red(Iro.inverse(' SEMANTICS ERROR   '), '  '), Iro.white('123'));
    Log.tapInfo('123')({} as any);
    expect(mockLog).toHaveBeenCalledWith(Iro.cyan(Iro.inverse(' SEMANTICS INFO    '), '  '), Iro.white('123'));
  });
});
