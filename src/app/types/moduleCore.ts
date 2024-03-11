import { Metadata, MetadataLike, MetadataProtocol } from './metadata'
import { Content } from './content'

export interface ModuleCore {
  id: string
  title: string
  abbrev: string
}

export interface ModuleLike {
  metadata: MetadataLike
  deContent: Content
  enContent: Content
}

export interface Module extends ModuleLike {
  id: string
  metadata: Metadata
  deContent: Content
  enContent: Content
}

export interface ModuleProtocol extends ModuleLike {
  metadata: MetadataProtocol
  deContent: Content
  enContent: Content
}
