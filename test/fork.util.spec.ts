import { fork } from '../src/utils/fork.util';

describe('fork', () => {
  it('should choose ifYes way if equation was truthy', () => {
    expect(fork(() => true, () => 1, () => 2)(null)).toEqual(1);
  });

  it('should choose ifNo way if equation was falsy', () => {
    expect(fork<number>(() => false, (x) => x + 10000, (x) => x + 1)(2)).toEqual(3);
  });
});
