import { StudyProgram } from './core/study-program'
import { DefaultPerson } from './core/person'

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
  studyProgram: Partial<StudyProgram>
  comment: string,
  respondedBy: DefaultPerson,
  respondedAt: string
}
