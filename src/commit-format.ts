/**
 * Git commit format template.
 */
export const commitFormat: string =
  "{" +
  "^^^hash^^^: ^^^%H^^^," +
  "^^^abbrevHash^^^: ^^^%h^^^," +
  "^^^author^^^: {" +
  "^^^name^^^: ^^^%aN^^^," +
  "^^^email^^^: ^^^%aE^^^" +
  "}," +
  "^^^description^^^: ^^^%s^^^," +
  "^^^body^^^: ^^^%b^^^" +
  "}";
