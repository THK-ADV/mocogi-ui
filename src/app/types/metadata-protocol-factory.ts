import { Participants } from './participants'
import { ModuleRelation } from './module-relation'
import { AssessmentMethods } from './assessment-methods'
import { POs } from './pos'
import { WorkloadProtocol } from './workload'
import { MetadataProtocol } from './metadata'
import { ModuleCompendiumProtocol } from './module-compendium'
import { Content } from './content'
import { toNumber, toString } from './type-conversions'

// export interface LearningOutcome {
//   what: string
//   whereby: string
//   wherefore: string
// }

function fromArray(any: any, key?: string) {
  return (any as Array<{ value: any }>).map(a => key ? a.value[key] : a.value)
}

function singleValue(any: any, property: string): unknown | undefined {
  const res = (any[property] as Array<{ value: any }>).map(a => a.value)
  return res.length === 0 ? undefined : res[0]
}

export function createMetadataProtocol(any: any): ModuleCompendiumProtocol {

  function metadata(): MetadataProtocol {
    return {
      title: toString(any['title']),
      abbrev: toString(any['abbreviation']),
      moduleType: toString(any['moduleType'].abbrev),
      ects: toNumber(any['ects']),
      language: toString(any['language'].abbrev),
      duration: toNumber(any['duration']),
      season: toString(any['season'].abbrev),
      workload: workload(),
      status: toString(any['status'].abbrev),
      location: toString(any['location'].abbrev),
      participants: participants(),
      moduleRelation: moduleRelation(),
      moduleManagement: [toString(any['moduleCoordinator'].id)],
      lecturers: fromArray(any['lecturer'], 'id'),
      assessmentMethods: assessmentMethods(),
      prerequisites: prerequisites(),
      po: po(),
      competences: fromArray(any['competences'], 'abbrev'),
      globalCriteria: fromArray(any['global-criteria'], 'abbrev'),
      taughtWith: fromArray(any['taught-with'], 'id')
    }
  }

  function participants(): Participants | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return singleValue(any, 'participants')
  }

  function workload(): WorkloadProtocol {
    return {
      lecture: toNumber(any['workload-lecture']),
      seminar: toNumber(any['workload-seminar']),
      practical: toNumber(any['workload-practical']),
      exercise: toNumber(any['workload-exercise']),
      projectSupervision: toNumber(any['workload-projectSupervision']),
      projectWork: toNumber(any['workload-projectWork'])
    }
  }

  function assessmentMethods(): AssessmentMethods {
    return {
      mandatory: fromArray(any['assessment-methods-mandatory']),
      optional: fromArray(any['assessment-methods-optional'])
    }
  }

  function prerequisites() {
    return {
      recommended: {
        text: toString(any['recommended-prerequisites-text']),
        pos: fromArray(any['recommended-prerequisites-po'], 'id'),
        modules: fromArray(any['recommended-prerequisites-modules'], 'id'),
      },
      required: {
        text: toString(any['required-prerequisites-text']),
        pos: fromArray(any['required-prerequisites-po'], 'id'),
        modules: fromArray(any['required-prerequisites-modules'], 'id'),
      }
    }
  }

  function po(): POs {
    return {
      mandatory: fromArray(any['po-mandatory']),
      optional: fromArray(any['po-optional'])
    }
  }

  function moduleRelation(): ModuleRelation | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return singleValue(any, 'module-relation')
  }

  // function learningOutCome(): { de: LearningOutcome, en: LearningOutcome } {
  //   return {
  //     de: {
  //       what: toString(any['learning-outcome-content-what-de']),
  //       whereby: toString(any['learning-outcome-content-whereby-de']),
  //       wherefore: toString(any['learning-outcome-content-wherefore-de']),
  //     },
  //     en: {
  //       what: toString(any['learning-outcome-content-what-en']),
  //       whereby: toString(any['learning-outcome-content-whereby-en']),
  //       wherefore: toString(any['learning-outcome-content-wherefore-en']),
  //     }
  //   }
  // }

  function deContent(): Content {
    return {
      learningOutcome: toString(any['learning-outcome-content-de']),
      content: toString(any['module-content-de']),
      teachingAndLearningMethods: toString(any['learning-methods-content-de']),
      recommendedReading: toString(any['literature-content-de']),
      particularities: toString(any['particularities-content-de']),
    }
  }

  function enContent(): Content {
    return {
      learningOutcome: toString(any['learning-outcome-content-en']),
      content: toString(any['module-content-en']),
      teachingAndLearningMethods: toString(any['learning-methods-content-en']),
      recommendedReading: toString(any['literature-content-en']),
      particularities: toString(any['particularities-content-en']),
    }
  }

  return {
    metadata: metadata(),
    deContent: deContent(),
    enContent: enContent()
  }
}
