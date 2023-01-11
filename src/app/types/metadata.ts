import { Workload } from './workload'
import { Participants } from './participants'
import { ModuleRelation } from './module-relation'
import { AssessmentMethods } from './assessment-methods'
import { PrerequisitesOutput } from './prerequisites'
import { POs } from './pos'

export interface Metadata {
  id: string,
  title: string,
  abbrev: string,
  moduleType: string,
  ects: number,
  language: string,
  duration: number,
  season: string,
  workload: Workload,
  status: string,
  location: string,
  participants?: Participants,
  moduleRelation?: ModuleRelation,
  moduleManagement: string[],
  lecturers: string[],
  assessmentMethods: AssessmentMethods,
  prerequisites: PrerequisitesOutput,
  po: POs,
  competences: string[],
  globalCriteria: string[],
  taughtWith: string[]
}
