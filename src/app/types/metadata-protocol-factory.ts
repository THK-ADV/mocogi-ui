import { Participants } from './participants'
import { Child, ModuleRelation, Parent } from './module-relation'
import { AssessmentMethods } from './assessment-methods'
import { POs } from './pos'
import { WorkloadProtocol } from './workload'
import { MetadataProtocol } from './metadata'
import { ModuleCompendiumProtocol } from './module-compendium'
import { Content } from './content'
import { toNumber, toString } from './type-conversions'
import { throwError as throwError_ } from './error'

// export interface LearningOutcome {
//   what: string
//   whereby: string
//   wherefore: string
// }

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

function throwError(key: string, record: Record<string, unknown>): never {
  throwError_(`expected key '${key}', but found ${record}`)
}

function fromArray(any: any, key?: string) {
  return (any as Array<{ value: any }>).map(a => key ? a.value[key] : a.value)
}

function singleValue(any: any, property: string): unknown | undefined {
  const res = (any[property] as Array<{ value: any }>).map(a => a.value)
  return res.length === 0 ? undefined : res[0]
}

function parse<A>(key: string, record: Record<string, unknown>, f: (u: unknown) => A): A {
  return key in record ? f(record[key]) : throwError(key, record)
}

export function parseString(key: string, record: Record<string, unknown>): string {
  return parse(key, record, u => toString(u))
}

export function parseNumber(key: string, record: Record<string, unknown>): number {
  return parse(key, record, u => toNumber(u))
}

export function parsePeekString(keys: ReadonlyArray<string>, record: Record<string, unknown>): string {
  const key = keys[0]
  return keys.length === 1
    ? parseString(key, record)
    : parse(key, record, v => parsePeekString(keys.slice(1), asRecord(v)))
}

export function parseArray(keys: ReadonlyArray<string>, record: Record<string, unknown>): string[] {
  if (keys.length === 0) {
    return []
  }
  const key = keys[0]
  return parse(key, record, values => {
    if (Array.isArray(values)) {
      return values.map(value => parsePeekString(keys.slice(1), asRecord(value)))
    }
    return []
  })
}

export function parseNestedAbbrev(key: string, record: Record<string, unknown>): string {
  return parsePeekString([key, 'abbrev'], record)
}

export function parseTitle(record: Record<string, unknown>): string {
  return parseString('title', record)
}

export function parseAbbreviation(record: Record<string, unknown>): string {
  return parseString('abbreviation', record)
}

export function parseModuleType(record: Record<string, unknown>): string {
  return parseNestedAbbrev('moduleType', record)
}

export function parseECTS(record: Record<string, unknown>): number {
  return parseNumber('ects', record)
}

export function parseLanguage(record: Record<string, unknown>): string {
  return parseNestedAbbrev('language', record)
}

export function parseDuration(record: Record<string, unknown>): number {
  return parseNumber('duration', record)
}

export function parseSeason(record: Record<string, unknown>): string {
  return parseNestedAbbrev('season', record)
}

export function parseWorkload(record: Record<string, unknown>): WorkloadProtocol {
  return {
    lecture: parseNumber('workload-lecture', record),
    seminar: parseNumber('workload-seminar', record),
    practical: parseNumber('workload-practical', record),
    exercise: parseNumber('workload-exercise', record),
    projectSupervision: parseNumber('workload-projectSupervision', record),
    projectWork: parseNumber('workload-projectWork', record)
  }
}

export function parseStatus(record: Record<string, unknown>): string {
  return parseNestedAbbrev('status', record)
}

export function parseLocation(record: Record<string, unknown>): string {
  return parseNestedAbbrev('location', record)
}

export function parseParticipants(record: Record<string, unknown>): Participants | undefined {
  return parse('participants', record, value => {
    if (Array.isArray(value) && value.length === 0) {
      return undefined
    }
    return parse('value', asRecord(value), participants => {
      const participantsRecord = asRecord(participants)
      return {
        min: parseNumber('min', participantsRecord),
        max: parseNumber('max', participantsRecord)
      }
    })
  })
}

export function parseModuleRelation(record: Record<string, unknown>): ModuleRelation | undefined {
  return parse('module-relation', record, value => {
    if (Array.isArray(value) && value.length === 0) {
      return undefined
    }
    return parse<ModuleRelation | undefined>('value', asRecord(value), moduleRelation => {
      const moduleRelationRecord = asRecord(moduleRelation)
      const kind = parseString('kind', moduleRelationRecord)
      switch (kind) {
        case 'child':
          return moduleRelation as Child
        case 'parent':
          return moduleRelation as Parent
        default:
          return undefined
      }
    })
  })
}

export function parseModuleManagement(record: Record<string, unknown>): string[] {
  const res = parsePeekString(['moduleCoordinator', 'id'], record)
  return res !== '' ? [res] : []
}

export function parseLecturers(record: Record<string, unknown>): string[] {
  return parseArray(['lecturer', 'value', 'id'], record)
}

export function parseAssessmentMethods(record: Record<string, unknown>): AssessmentMethods {
  return {
    mandatory: fromArray(any['assessment-methods-mandatory']),
    optional: fromArray(any['assessment-methods-optional'])
  }
}

export function parseDeContent(any: any): Content {
  return {
    learningOutcome: toString(any['learning-outcome-content-de']),
    content: toString(any['module-content-de']),
    teachingAndLearningMethods: toString(any['learning-methods-content-de']),
    recommendedReading: toString(any['literature-content-de']),
    particularities: toString(any['particularities-content-de']),
  }
}

export function parseEnContent(any: any): Content {
  return {
    learningOutcome: toString(any['learning-outcome-content-en']),
    content: toString(any['module-content-en']),
    teachingAndLearningMethods: toString(any['learning-methods-content-en']),
    recommendedReading: toString(any['literature-content-en']),
    particularities: toString(any['particularities-content-en']),
  }
}

export function parsePrerequisites(any: any) {
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

export function parsePo(any: any): POs {
  return {
    mandatory: fromArray(any['po-mandatory']),
    optional: fromArray(any['po-optional'])
  }
}

export function parseMetadata(any: any): MetadataProtocol {
  return {
    title: parseTitle(any),
    abbrev: parseAbbreviation(any),
    moduleType: parseModuleType(any),
    ects: parseECTS(any),
    language: parseLanguage(any),
    duration: parseDuration(any),
    season: parseSeason(any),
    workload: parseWorkload(any),
    status: parseStatus(any),
    location: parseLocation(any),
    participants: parseParticipants(any),
    moduleRelation: parseModuleRelation(any),
    moduleManagement: parseModuleManagement(any),
    lecturers: parseLecturers(any),
    assessmentMethods: parseAssessmentMethods(any),
    prerequisites: parsePrerequisites(any),
    po: parsePo(any),
    competences: fromArray(any['competences'], 'abbrev'),
    globalCriteria: fromArray(any['global-criteria'], 'abbrev'),
    taughtWith: fromArray(any['taught-with'], 'id')
  }
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null && value !== undefined) {
    return value as Record<string, unknown>
  } else {
    throwError_(`expected value ${value} to be convertable to a record`)
  }
}

export function createMetadataProtocol(value: unknown): ModuleCompendiumProtocol {
  const record = asRecord(value)
  return {
    metadata: parseMetadata(record),
    deContent: parseDeContent(record),
    enContent: parseEnContent(record)
  }
}
