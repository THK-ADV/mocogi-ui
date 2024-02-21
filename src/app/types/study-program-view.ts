import { IdLabel } from './idlabel'

export interface SpecializationShort {
  abbrev: string,
  label: string
}

export interface StudyProgramView {
  poId: string,
  poVersion: number,
  studyProgram: IdLabel,
  degree: string,
  specialization?: IdLabel
}
