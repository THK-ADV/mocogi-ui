import { StudyProgram } from './module-compendium'
import { Role } from './approval'

export interface StudyProgramPrivileges {
  studyProgram: StudyProgram
  roles: Role[]
}
