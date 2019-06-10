export const fork = <T>(checkFunction: (ctx: T) => boolean, ifTrue: (ctx: T) => any, ifFalse: (ctx: T) => any) => (
  ctx: T
) => (checkFunction(ctx) ? ifTrue(ctx) : ifFalse(ctx));
