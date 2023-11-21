import { Grade } from './core/grade'

export interface ModuleCompendiumList {
  poAbbrev: string,
  poNumber: number,
  studyProgram: StudyProgramShort,
  semester: Semester,
  deUrl: string,
  enUrl: string,
}

export interface StudyProgramShort {
  abbrev: string,
  deLabel: string,
  enLabel: string,
  grade: Grade
}

export interface Semester {
  id: string,
  year: number,
  abbrev: string,
  deLabel: string,
  enLabel: string,
}
