import { Workload, WorkloadLike, WorkloadProtocol } from './workload'
import { Participants } from './participants'
import { ModuleRelation } from './module-relation'
import { AssessmentMethods } from './assessment-methods'
import { PrerequisitesOutput } from './prerequisites'
import { POs } from './pos'
import { Examiner } from './examiner'

export interface MetadataLike {
  title: string
  abbrev: string
  moduleType: string
  ects: number
  language: string
  duration: number
  season: string
  workload: WorkloadLike
  status: string
  location: string
  participants?: Participants
  moduleRelation?: ModuleRelation
  moduleManagement: string[]
  lecturers: string[]
  assessmentMethods: AssessmentMethods
  prerequisites: PrerequisitesOutput
  po: POs
  competences: string[]
  globalCriteria: string[]
  taughtWith: string[]
  examPhases: string[]
  examiner: Examiner
}

export interface Metadata extends MetadataLike {
  title: string
  abbrev: string
  moduleType: string
  ects: number
  language: string
  duration: number
  season: string
  workload: Workload
  status: string
  location: string
  participants?: Participants
  moduleRelation?: ModuleRelation
  moduleManagement: string[]
  lecturers: string[]
  assessmentMethods: AssessmentMethods
  prerequisites: PrerequisitesOutput
  po: POs
  competences: string[]
  globalCriteria: string[]
  taughtWith: string[]
  examPhases: string[]
  examiner: Examiner
}

export interface MetadataProtocol extends MetadataLike {
  title: string
  abbrev: string
  moduleType: string
  ects: number
  language: string
  duration: number
  season: string
  workload: WorkloadProtocol
  status: string
  location: string
  participants?: Participants
  moduleRelation?: ModuleRelation
  moduleManagement: string[]
  lecturers: string[]
  assessmentMethods: AssessmentMethods
  prerequisites: PrerequisitesOutput
  po: POs
  competences: string[]
  globalCriteria: string[]
  taughtWith: string[]
  examPhases: string[]
  examiner: Examiner
}
