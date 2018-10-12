export const flatten = (xs: any[]) =>
  Array.from(new Set(xs.reduce((x, y) => x.concat(Array.isArray(y) ? flatten(y) : y), [])));
