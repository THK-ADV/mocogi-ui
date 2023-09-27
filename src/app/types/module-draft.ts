import { ModuleCompendiumProtocol } from './module-compendium'

export type ModuleDraftStatus = 'added' | 'modified'

export interface ModuleDraft {
  module: string
  data: ModuleCompendiumProtocol
  branch: string
  status: ModuleDraftStatus,
  keysToBeReviewed: ReadonlyArray<string>
  modifiedKeys: ReadonlyArray<string>
  lastModified: Date
}
