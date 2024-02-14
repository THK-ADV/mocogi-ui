import { StudyProgram } from "./module-compendium";

export type IdentityKind = 'person' | 'group' | 'unknown'

export interface PersonShort {
  id: string,
  abbrev: string,
  kind: IdentityKind,
  title: string,
  firstname: string,
  lastname: string
}

export interface StudyProgramModuleAssociation {
  studyProgram: StudyProgram
  mandatory: boolean,
  recommendedSemester: number[]
}


export interface ModuleView {
  id: string,
  title: string,
  abbrev: string,
  ects: number,
  moduleManagement: ReadonlyArray<PersonShort>,
  studyProgram: ReadonlyArray<StudyProgramModuleAssociation>
}
