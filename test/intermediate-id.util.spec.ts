import { intermediateId } from '../src/utils/intermediate-id.util';

describe('intermediateId', () => {
  it('should return contents of the intermediate object', () => {
    const intermediate = { bool: true };
    expect(intermediateId({ intermediate })).toEqual(intermediate);
  });
});
