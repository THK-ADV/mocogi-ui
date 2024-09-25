import { Semester, StudyProgram } from './module-compendium'

export interface ElectivesCatalogue {
  poAbbrev: string
  poNumber: number
  studyProgram: StudyProgram
  semester: Semester
  url: string
}
