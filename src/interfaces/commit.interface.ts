export interface CommitInterface {
  hash: string;
  abbrevHash: string;
  author: {
    name: string;
    email: string;
  };
  description: string;
  body: string[];
  footer: string[];
  type: string;
  hasPatchUpdate: boolean;
  hasMinorUpdate: boolean;
  hasMajorUpdate: boolean;
  scope?: string;
  breakingChanges: string[];
}
