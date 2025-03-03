import { Participants } from './participants'
import { ModuleRelation } from './module-relation'
import { AssessmentMethodEntry, AssessmentMethods } from './assessment-methods'
import { POMandatory, POOptional, POs } from './pos'
import { WorkloadProtocol } from './workload'
import { MetadataProtocol } from './metadata'
import { ModuleProtocol } from './moduleCore'
import { Content } from './content'
import { toNumber, toString } from '../parser/type-conversions'
import { PrerequisiteEntry, PrerequisitesOutput } from './prerequisites'
import {
  asRecord,
  parse,
  parseArray,
  parseBoolean,
  parseNumber,
  parseOptional,
  parsePeekArray,
  parsePeekString,
  parseString,
} from '../parser/record-parser'
import { FormGroup } from '@angular/forms'
import { Examiner } from './examiner'

export function parseNestedId(
  key: string,
  record: Record<string, unknown>,
): string {
  return parsePeekString([key, 'id'], record)
}

export function parseTitle(record: Record<string, unknown>): string {
  return parseString('title', record)
}

export function parseAbbreviation(record: Record<string, unknown>): string {
  return parseString('abbreviation', record)
}

export function parseModuleType(record: Record<string, unknown>): string {
  return parseNestedId('moduleType', record)
}

export function parseECTS(record: Record<string, unknown>): number {
  return parseNumber('ects', record)
}

export function parseLanguage(record: Record<string, unknown>): string {
  return parseNestedId('language', record)
}

export function parseDuration(record: Record<string, unknown>): number {
  return parseNumber('duration', record)
}

export function parseSeason(record: Record<string, unknown>): string {
  return parseNestedId('season', record)
}

export function parseWorkload(
  record: Record<string, unknown>,
): WorkloadProtocol {
  return {
    lecture: parseNumber('workload-lecture', record),
    seminar: parseNumber('workload-seminar', record),
    practical: parseNumber('workload-practical', record),
    exercise: parseNumber('workload-exercise', record),
    projectSupervision: parseNumber('workload-projectSupervision', record),
    projectWork: parseNumber('workload-projectWork', record),
  }
}

export function parseStatus(record: Record<string, unknown>): string {
  return parseNestedId('status', record)
}

export function parseLocation(record: Record<string, unknown>): string {
  return parseNestedId('location', record)
}

export function parseParticipants(
  record: Record<string, unknown>,
): Participants | undefined {
  const participants = parseArray('participants', record, (x) => {
    return parse('value', asRecord(x), (p) => {
      const participantsRecord = asRecord(p)
      return {
        min: parseNumber('min', participantsRecord),
        max: parseNumber('max', participantsRecord),
      }
    })
  })
  return participants.shift()
}

export function parseModuleRelation(
  record: Record<string, unknown>,
): ModuleRelation | undefined {
  const relations = parseArray('module-relation', record, (x) => {
    return parse<ModuleRelation>('value', asRecord(x), (moduleRelation) => {
      const moduleRelationRecord = asRecord(moduleRelation)
      const kind = parseString('kind', moduleRelationRecord)
      switch (kind) {
        case 'child':
          return {
            kind: 'child',
            parent: parseString('parent', moduleRelationRecord),
          }
        case 'parent':
          return {
            kind: 'parent',
            children: parseArray('children', moduleRelationRecord, (c) =>
              toString(c),
            ),
          }
        default:
          throw new Error(
            `expected 'kind' to be 'child' or 'parent', but was ${kind}`,
          )
      }
    })
  })
  return relations.shift()
}

export function parseModuleManagement(
  record: Record<string, unknown>,
): string[] {
  const res = parsePeekString(['moduleCoordinator', 'id'], record)
  return res !== '' ? [res] : []
}

export function parseLecturers(record: Record<string, unknown>): string[] {
  return parsePeekArray(['lecturer', 'value', 'id'], record)
}

export function parseAssessmentMethods(
  record: Record<string, unknown>,
): AssessmentMethods {
  function go(key: string): AssessmentMethodEntry[] {
    return parse(key, record, (xs) => {
      if (Array.isArray(xs)) {
        return xs.map((x) =>
          parse('value', asRecord(x), (v) => {
            const xRecord = asRecord(v)
            return {
              method: parseString('method', xRecord),
              percentage: parseOptional('percentage', xRecord, (p) =>
                toNumber(p),
              ),
              precondition: parseArray('precondition', xRecord, (s) =>
                toString(s),
              ),
            }
          }),
        )
      }
      return []
    })
  }

  return {
    mandatory: go('assessment-methods-mandatory'),
    optional: go('assessment-methods-optional'),
  }
}

export function parseDeContent(record: Record<string, unknown>): Content {
  return {
    learningOutcome: parseString('learning-outcome-content-de', record),
    content: parseString('module-content-de', record),
    teachingAndLearningMethods: parseString(
      'learning-methods-content-de',
      record,
    ),
    recommendedReading: parseString('literature-content-de', record),
    particularities: parseString('particularities-content-de', record),
  }
}

export function parseEnContent(record: Record<string, unknown>): Content {
  return {
    learningOutcome: parseString('learning-outcome-content-en', record),
    content: parseString('module-content-en', record),
    teachingAndLearningMethods: parseString(
      'learning-methods-content-en',
      record,
    ),
    recommendedReading: parseString('literature-content-en', record),
    particularities: parseString('particularities-content-en', record),
  }
}

export function parsePrerequisites(
  record: Record<string, unknown>,
): PrerequisitesOutput {
  function go(prefix: string): PrerequisiteEntry | undefined {
    const text =
      parseOptional(`${prefix}-prerequisites-text`, record, (v) =>
        toString(v),
      ) ?? ''
    const pos = parsePeekArray(
      [`${prefix}-prerequisites-po`, 'value', 'po', 'id'],
      record,
    )
    const modules = parsePeekArray(
      [`${prefix}-prerequisites-modules`, 'value', 'id'],
      record,
    )
    if (text === '' && pos.length === 0 && modules.length === 0) {
      return undefined
    }
    return { text, pos, modules }
  }

  return {
    recommended: go('recommended'),
    required: go('required'),
  }
}

export function parsePo(record: Record<string, unknown>): POs {
  const mandatory: POMandatory[] = parseArray('po-mandatory', record, (x) => {
    return parse('value', asRecord(x), (po) => {
      const poRecord = asRecord(po)
      return {
        po: parseString('po', poRecord),
        specialization: parseOptional('specialization', poRecord, (s) =>
          toString(s),
        ),
        recommendedSemester: parseArray('recommendedSemester', poRecord, (v) =>
          toNumber(v),
        ),
      }
    })
  })
  const optional: POOptional[] = parseArray('po-optional', record, (x) => {
    return parse('value', asRecord(x), (po) => {
      const poRecord = asRecord(po)
      return {
        po: parseString('po', poRecord),
        specialization: parseOptional('specialization', poRecord, (s) =>
          toString(s),
        ),
        instanceOf: parseString('instanceOf', poRecord),
        partOfCatalog: parseBoolean('partOfCatalog', poRecord),
        recommendedSemester: parseArray('recommendedSemester', poRecord, (v) =>
          toNumber(v),
        ),
      }
    })
  })
  return { mandatory, optional }
}

export function parseTaughtWith(record: Record<string, unknown>): string[] {
  return parsePeekArray(['taught-with', 'value', 'id'], record)
}

export function parseExamPhases(record: Record<string, unknown>): string[] {
  return parsePeekArray(['exam-phases', 'value', 'id'], record)
}

export function parseExaminer(record: Record<string, unknown>): Examiner {
  return {
    first: parseNestedId('first-examiner', record),
    second: parseNestedId('second-examiner', record),
  }
}

export function parseMetadata(
  record: Record<string, unknown>,
): MetadataProtocol {
  return {
    title: parseTitle(record),
    abbrev: parseAbbreviation(record),
    moduleType: parseModuleType(record),
    ects: parseECTS(record),
    language: parseLanguage(record),
    duration: parseDuration(record),
    season: parseSeason(record),
    workload: parseWorkload(record),
    status: parseStatus(record),
    location: parseLocation(record),
    participants: parseParticipants(record),
    moduleRelation: parseModuleRelation(record),
    moduleManagement: parseModuleManagement(record),
    lecturers: parseLecturers(record),
    assessmentMethods: parseAssessmentMethods(record),
    prerequisites: parsePrerequisites(record),
    po: parsePo(record),
    competences: [],
    globalCriteria: [],
    taughtWith: parseTaughtWith(record),
    examPhases: parseExamPhases(record),
    examiner: parseExaminer(record),
  }
}

export function parseModuleCompendium(
  formGroup: FormGroup,
): ModuleProtocol | undefined {
  if (!formGroup.value) {
    return undefined
  }
  const record = asRecord(formGroup.value)
  return {
    metadata: parseMetadata(record),
    deContent: parseDeContent(record),
    enContent: parseEnContent(record),
  }
}
