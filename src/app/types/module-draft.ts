import { ModuleCompendiumProtocol } from './module-compendium'

export type ModuleDraftSource = 'added' | 'modified'

export interface ModuleDraft {
  module: string
  data: ModuleCompendiumProtocol
  branch: string
  source: ModuleDraftSource,
  keysToBeReviewed: ReadonlyArray<string>
  modifiedKeys: ReadonlyArray<string>
  lastModified: Date
}
