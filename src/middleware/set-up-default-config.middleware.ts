import { SemanticsIntermediate } from '../interfaces/semantics-intermediate.interface';
import { Log } from '../utils/log.util';

export function setUpDefaultConfig(): Partial<SemanticsIntermediate> {
  Log.info('Setting up configuration...');

  return {
    repository: 'github',
    publishTag: true,
    oldestCommitsFirst: true,
    displayAuthor: false,
    commitTypesIncludedInTagMessage: [
      {
        type: 'feat',
        title: 'New features',
        bumps: 'minor',
      },
      {
        type: 'fix',
        title: 'Bug fixes',
        bumps: 'patch',
      },
    ],
    commitTypesExcludedFromTagMessage: [],
    tagMessage: true,
    prefix: '',
    postfix: '',
    configFilePath: '',
    writeTemporaryFiles: false,
    preciseVersionMatching: true,
    privateToken: '',
    projectPath: '',
  };
}
