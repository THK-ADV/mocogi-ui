import { Module } from './module'
import { ModuleDraft } from './module-draft'

export type ModeratedModule = {
  module: Module,
  moduleDraft: ModuleDraft | undefined,
  status: ModuleStatus
}

export type ModuleStatus =
  'published' |
  'waiting_for_approval' |
  'waiting_for_publication' |
  'valid_for_review' |
  'valid_for_publication' |
  'unknown'
