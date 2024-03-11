import { Degree } from './core/degree'

export interface LocalizedCore {
  id: string,
  deLabel: string,
  enLabel: string,
}

export interface ModuleCatalog {
  studyProgram: StudyProgram,
  semester: Semester,
  deUrl: string,
  enUrl: string,
  generated: string
}

export interface POCore {
  id: string,
  version: number
}

export interface StudyProgram extends StudyProgramCore {
  po: POCore
  specialization?: LocalizedCore
}

export interface StudyProgramCore extends LocalizedCore {
  degree: Degree
}

export interface Semester extends LocalizedCore {
  year: number,
  abbrev: string,
}
