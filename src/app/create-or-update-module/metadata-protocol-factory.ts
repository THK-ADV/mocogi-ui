import { Participants } from '../types/participants'
import { ModuleRelation } from '../types/module-relation'
import { AssessmentMethods } from '../types/assessment-methods'
import { POs } from '../types/pos'
import { WorkloadProtocol } from '../types/workload'
import { MetadataProtocol } from '../types/metadata'
import { ModuleCompendiumProtocol } from '../types/module-compendium'
import { Content } from '../types/content'

export interface LearningOutcome {
  what: string
  whereby: string
  wherefore: string
}

function fromArray(any: any, key?: string) {
  return (any as Array<{ value: any }>).map(a => key ? a.value[key] : a.value )
}

function singleValue(any: any, property: string): any | undefined {
  const res = (any[property] as Array<{ value: any }>).map(a => a.value)
  return res.length === 0 ? undefined : res[0]
}

export function createMetadataProtocol(any: any): ModuleCompendiumProtocol {

  function metadata(): MetadataProtocol {
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
      competences: fromArray(any['competences'], 'abbrev'),
      globalCriteria: fromArray(any['global-criteria'], 'abbrev'),
      taughtWith: fromArray(any['taught-with'], 'id')
    }
  }

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
      mandatory: fromArray(any['assessment-methods-mandatory']),
      optional: fromArray(any['assessment-methods-optional'])
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
      mandatory: fromArray(any['po-mandatory']),
      optional: fromArray(any['po-optional'])
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

  function deContent(): Content {
    return {
      learningOutcomeBody: 'TODO',
      contentBody: any['module-content-de'],
      teachingAndLearningMethodsBody: any['learning-methods-content-de'],
      recommendedReadingBody: any['literature-content-de'],
      particularitiesBody: any['particularities-content-de'],
    }
  }

  function enContent(): Content {
    return {
      learningOutcomeBody: 'TODO',
      contentBody: any['module-content-en'],
      teachingAndLearningMethodsBody: any['learning-methods-content-en'],
      recommendedReadingBody: any['literature-content-en'],
      particularitiesBody: any['particularities-content-en'],
    }
  }

  return {
    metadata: metadata(),
    deContent: deContent(),
    enContent: enContent()
  }
}
