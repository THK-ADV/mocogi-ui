export interface SpecializationShort {
  abbrev: string,
  label: string
}

export interface StudyProgramAtomic {
  poAbbrev: string,
  studyProgramAbbrev: string,
  studyProgramLabel: string,
  grade: string,
  version: number,
  specialization?: SpecializationShort
}
