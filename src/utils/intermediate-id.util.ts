import { MiddlewareContextInterface } from '@priestine/data';

export function intermediateId({ intermediate }: MiddlewareContextInterface) {
  return intermediate;
}
