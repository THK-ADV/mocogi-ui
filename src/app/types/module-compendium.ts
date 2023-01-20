import { Metadata, MetadataLike, MetadataProtocol } from './metadata'
import { Content } from './content'

export interface ModuleCompendiumLike {
  metadata: MetadataLike
  deContent: Content
  enContent: Content
}

export interface ModuleCompendium extends ModuleCompendiumLike {
  metadata: Metadata
  deContent: Content
  enContent: Content
}

export interface ModuleCompendiumProtocol extends ModuleCompendiumLike {
  metadata: MetadataProtocol
  deContent: Content
  enContent: Content
}
