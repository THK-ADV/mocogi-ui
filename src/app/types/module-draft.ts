import { ModuleCompendiumProtocol } from '../create-or-update-module/metadata-protocol-factory'

export type ModuleDraftStatus = 'added' | 'modified'

export interface ModuleDraft {
  module: string
  data: ModuleCompendiumProtocol
  branch: string
  status: ModuleDraftStatus,
  lastModified: Date
}
