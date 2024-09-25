import { ModuleProtocol } from './moduleCore'

export type ModuleDraftSource = 'added' | 'modified'

export interface ModuleDraft {
  module: string
  data: ModuleProtocol
  branch: string
  source: ModuleDraftSource
  keysToBeReviewed: ReadonlyArray<string>
  modifiedKeys: ReadonlyArray<string>
  lastModified: Date
}
