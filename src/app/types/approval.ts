import { Person } from './core/person'
import { IdLabel } from './idlabel'

export interface TranslatedLabel {
  deLabel: string,
  enLabel: string
}

export interface Role extends TranslatedLabel {
  id: string,
}

export interface ApprovalStatus extends TranslatedLabel {
  id: string
}

export type Approval = {
  id: string
  moduleDraft: string
  role: Role
  status: ApprovalStatus
  studyProgram: IdLabel,
  comment: string,
  respondedBy: Person,
  respondedAt: string
}
