import { Semester, StudyProgramShort } from "./module-compendium";

export interface ElectivesCatalogue {
  poAbbrev: string,
  poNumber: number,
  studyProgram: StudyProgramShort,
  semester: Semester,
  url: string,
}