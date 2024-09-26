import { ModuleCore } from './moduleCore'
import { ModuleDraft } from './module-draft'
import { Label } from './core/label'

export interface Published extends Label {
  id: 'published'
}

export interface WaitingForReview extends Label {
  id: 'waiting_for_review'
}

export interface WaitingForChanges extends Label {
  id: 'waiting_for_changes'
}

export interface ValidForReview extends Label {
  id: 'valid_for_review'
}

export interface ValidForPublication extends Label {
  id: 'valid_for_publication'
}

export interface Unknown extends Label {
  id: 'unknown'
}

export type ModuleDraftState =
  | Published
  | ValidForReview
  | ValidForPublication
  | WaitingForReview
  | WaitingForChanges
  | Unknown

export type ModeratedModule = {
  module: ModuleCore
  moduleDraft: ModuleDraft | undefined
  moduleDraftState: ModuleDraftState
}
