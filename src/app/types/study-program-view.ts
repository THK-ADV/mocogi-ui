import { IdLabel } from './idlabel'

export interface SpecializationShort {
  id: string,
  label: string
}

export interface StudyProgramView {
  poId: string,
  poVersion: number,
  studyProgram: IdLabel,
  degree: string,
  specialization?: IdLabel
}
