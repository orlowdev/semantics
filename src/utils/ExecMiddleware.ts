import { Middleware } from '@priestine/data/src';
import { execPromise } from './exec-promise';

export const ExecMiddleware = Middleware.of(execPromise);
