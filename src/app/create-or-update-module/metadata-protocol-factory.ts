import { AssessmentMethods, MetadataProtocol, Participants, POs, Workload } from '../http/http.service'

function fromArray(any: any, key: string) {
  return (any as Array<{ value: any }>).map(a => a.value[key])
}

export function createMetadataProtocol(any: any): MetadataProtocol {
  function participants(): Participants | undefined {
    const res = (any['participants'] as Array<{ value: any }>).map(a => a.value)
    return res.length === 0 ? undefined : res[0]
  }

  function workload(): Workload {
    return {
      lecture: any['workload-lecture'],
      seminar: any['workload-seminar'],
      practical: any['workload-practical'],
      exercise: any['workload-exercise'],
      projectSupervision: any['workload-projectSupervision'],
      projectWork: any['workload-projectWork'],
      selfStudy: 0, // TODO
      total: 0 // TODO
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
    moduleRelation: undefined, // TODO
    moduleManagement: [any['moduleCoordinator'].id],
    lecturers: fromArray(any['lecturer'], 'id'),
    assessmentMethods: assessmentMethods(),
    prerequisites: prerequisites(),
    po: po(),
    competences: any['competences'],
    globalCriteria: any['global-criteria'],
    taughtWith: any['taught-with']
  }
}
