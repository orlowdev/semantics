export interface CommitTypeInterface {
  title: string;
  type: string;
  bumps?: 'patch' | 'minor' | 'major';
}
