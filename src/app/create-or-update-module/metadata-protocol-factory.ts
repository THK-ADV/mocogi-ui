import { AssessmentMethods, ModuleRelation, Participants, POs, PrerequisitesOutput } from '../http/http.service'

export interface LearningOutcome {
  what: string
  whereby: string
  wherefore: string
}

export interface WorkloadProtocol {
  lecture: number,
  seminar: number,
  practical: number,
  exercise: number,
  projectSupervision: number,
  projectWork: number
}

export interface ModuleCompendiumProtocol {
  title: string,
  abbrev: string,
  moduleType: string,
  ects: number,
  language: string,
  duration: number,
  season: string,
  workload: WorkloadProtocol,
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
  taughtWith: string[],
  learningOutcome: { de: LearningOutcome, en: LearningOutcome },
  moduleContent: { de: string, en: string },
  learningMethodsContent: { de: string, en: string },
  literatureContent: { de: string, en: string },
  particularitiesContent: { de: string, en: string },
}

function fromArray(any: any, key: string) {
  return (any as Array<{ value: any }>).map(a => a.value[key])
}

function singleValue(any: any, property: string): any | undefined {
  const res = (any[property] as Array<{ value: any }>).map(a => a.value)
  return res.length === 0 ? undefined : res[0]
}

export function createMetadataProtocol(any: any): ModuleCompendiumProtocol {
  function participants(): Participants | undefined {
    return singleValue(any, 'participants')
  }

  function workload(): WorkloadProtocol {
    return {
      lecture: any['workload-lecture'],
      seminar: any['workload-seminar'],
      practical: any['workload-practical'],
      exercise: any['workload-exercise'],
      projectSupervision: any['workload-projectSupervision'],
      projectWork: any['workload-projectWork']
    }
  }

  function assessmentMethods(): AssessmentMethods {
    return {
      mandatory: fromArray(any['assessment-methods-mandatory'], 'method'),
      optional: fromArray(any['assessment-methods-optional'], 'method')
    }
  }

  function prerequisites() {
    return {
      recommended: {
        text: any['recommended-prerequisites-text'],
        pos: fromArray(any['recommended-prerequisites-po'], 'id'),
        modules: fromArray(any['recommended-prerequisites-modules'], 'id'),
      },
      required: {
        text: any['required-prerequisites-text'],
        pos: fromArray(any['required-prerequisites-po'], 'id'),
        modules: fromArray(any['required-prerequisites-modules'], 'id'),
      }
    }
  }

  function po(): POs {
    return {
      mandatory: fromArray(any['po-mandatory'], 'po'),
      optional: fromArray(any['po-optional'], 'po')
    }
  }

  function moduleRelation(): ModuleRelation | undefined {
    return singleValue(any, 'module-relation')
  }

  function learningOutCome(): { de: LearningOutcome, en: LearningOutcome } {
    return {
      de: {
        what: any['learning-outcome-content-what-de'],
        whereby: any['learning-outcome-content-whereby-de'],
        wherefore: any['learning-outcome-content-wherefore-de'],
      },
      en: {
        what: any['learning-outcome-content-what-en'],
        whereby: any['learning-outcome-content-whereby-en'],
        wherefore: any['learning-outcome-content-wherefore-en'],
      }
    }
  }

  function moduleContent(): { de: string, en: string } {
    return {
      de: any['module-content-de'],
      en: any['module-content-en']
    }
  }

  function learningMethodsContent(): { de: string, en: string } {
    return {
      de: any['learning-methods-content-de'],
      en: any['learning-methods-content-en']
    }
  }

  function literatureContent(): { de: string, en: string } {
    return {
      de: any['literature-content-de'],
      en: any['literature-content-en']
    }
  }

  function particularitiesContent(): { de: string, en: string } {
    return {
      de: any['particularities-content-de'],
      en: any['particularities-content-en']
    }
  }

  return {
    title: any['title'],
    abbrev: any['abbreviation'],
    moduleType: any['moduleType'].abbrev,
    ects: any['ects'],
    language: any['language'].abbrev,
    duration: any['duration'],
    season: any['season'].abbrev,
    workload: workload(),
    status: any['status'].abbrev,
    location: any['location'].abbrev,
    participants: participants(),
    moduleRelation: moduleRelation(),
    moduleManagement: [any['moduleCoordinator'].id],
    lecturers: fromArray(any['lecturer'], 'id'),
    assessmentMethods: assessmentMethods(),
    prerequisites: prerequisites(),
    po: po(),
    competences: any['competences'],
    globalCriteria: any['global-criteria'],
    taughtWith: any['taught-with'],
    learningOutcome: learningOutCome(),
    moduleContent: moduleContent(),
    learningMethodsContent: learningMethodsContent(),
    literatureContent: literatureContent(),
    particularitiesContent: particularitiesContent()
  }
}
