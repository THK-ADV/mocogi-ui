import { Grade } from './core/grade'

export interface ModuleCompendium {
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
