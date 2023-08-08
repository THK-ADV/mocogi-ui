import { SpecializationShort } from './study-program-atomic'

export type PersonShortKind = 'default' | 'group' | 'unknown'

export interface PersonShort {
  id: string,
  abbrev: string,
  kind: PersonShortKind,
  title: string,
  firstname: string,
  lastname: string
}

export interface StudyProgramModuleAssociation {
  poAbbrev: string,
  studyProgramAbbrev: string,
  studyProgramLabel: string,
  grade: string,
  version: number,
  specialization?: SpecializationShort,
  mandatory: boolean,
  recommendedSemester: number[]
}


export interface ModuleAtomic {
  id: string,
  title: string,
  abbrev: string,
  ects: number,
  moduleManagement: ReadonlyArray<PersonShort>,
  studyProgram: ReadonlyArray<StudyProgramModuleAssociation>
}
