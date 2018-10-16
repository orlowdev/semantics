/**
 * Git commit format template.
 */
export const commitFormat: string =
  '{' +
  '^^^hash^^^: ^^^%H^^^,' +
  '^^^abbrevHash^^^: ^^^%h^^^,' +
  '^^^author^^^: {' +
  '^^^name^^^: ^^^%aN^^^,' +
  '^^^email^^^: ^^^%aE^^^' +
  '},' +
  '^^^subject^^^: ^^^%s^^^,' +
  '^^^body^^^: ^^^%b^^^' +
  '}';
