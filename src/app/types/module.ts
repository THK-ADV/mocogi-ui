import { Metadata, MetadataLike, MetadataProtocol } from './metadata'
import { Content } from './content'

export interface Module {
  id: string
  title: string
  abbrev: string
}

export interface ModuleDescriptionLike {
  metadata: MetadataLike
  deContent: Content
  enContent: Content
}

export interface ModuleDescription extends ModuleDescriptionLike {
  metadata: Metadata
  deContent: Content
  enContent: Content
}

export interface ModuleCompendiumProtocol extends ModuleDescriptionLike {
  metadata: MetadataProtocol
  deContent: Content
  enContent: Content
}
