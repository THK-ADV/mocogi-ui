import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module.reducer'
import {
  selectGrades,
  selectPeople,
  selectPOs,
  selectSelectedCoordinatorId,
  selectSelectedPOId,
  selectSelectedSemester,
  selectStudyPrograms,
  StudyProgramWithPO
} from './module-filter.selectors'
import { Metadata } from '../../types/metadata'
import { mapFilterUndefined } from '../../ops/array.ops'
import { Person } from '../../types/core/person'
import { toTableRepresentation } from '../../module/module-list/module-table-representation'

export type MetadataAtomic =
  Omit<Metadata, 'moduleManagement'> & {
  moduleManagement: Person[],
  poMandatoryAtomic: {
    po: StudyProgramWithPO,
    recommendedSemester: number[],
    recommendedSemesterPartTime: number[]
  }[]
}

export const selectModuleState = createFeatureSelector<State>('module')

export const selectModules = createSelector(
  selectModuleState,
  (state) => state.modules
)

export const selectModuleFilter = createSelector(
  selectModuleState,
  (state) => state.moduleFilter
)

export const selectSelectedSort = createSelector(
  selectModuleState,
  (state) => state.selectedSort
)

const selectMetadataAtomic = createSelector(
  selectModules,
  selectPeople,
  selectStudyPrograms,
  selectPOs,
  selectGrades,
  (modules, people, studyPrograms, pos, grades) =>
    <MetadataAtomic[]>modules.map(m => {
      const moduleManagement = mapFilterUndefined(m.moduleManagement, m => people.find(p => p.id === m))
      const poMandatoryAtomic = mapFilterUndefined(m.po.mandatory, poMandatory => {
        const po = pos.find(po => po.abbrev === poMandatory.po)
        const sp = studyPrograms.find(sp => sp.abbrev === po?.program)
        const g = grades.find(g => g.abbrev === sp?.grade)
        return po && sp && g
          ? {...poMandatory, po: [po, sp, g]}
          : undefined
      })
      return {...m, moduleManagement, poMandatoryAtomic}
    })
)

function titleFilter(filter: string) {
  filter = filter.trim().toLowerCase()
  return (m: MetadataAtomic) =>
    m.title.toLowerCase().includes(filter) ||
    m.abbrev.toLowerCase().includes(filter) ||
    m.moduleManagement.some(c => {
        switch (c.kind) {
          case 'group':
          case 'unknown':
            return c.title.toLowerCase().includes(filter)
          case 'single':
            return c.abbreviation.toLowerCase().includes(filter) ||
              c.lastname.toLowerCase().includes(filter) ||
              c.firstname.toLowerCase().includes(filter)
        }
      }
    )
}

function coordinatorFilter(coordinatorId: string) {
  return (m: MetadataAtomic) =>
    m.moduleManagement.some(m => m.id === coordinatorId)
}

function poFilter(poId: string) {
  return (m: MetadataAtomic) =>
    m.po.mandatory.some(po => po.po === poId) ||
    m.po.optional.some(po => po.po === poId)
}

function semesterFilter(semester: number) {
  return (m: MetadataAtomic) =>
    m.po.mandatory.some(po => po.recommendedSemester.includes(semester)) ||
    m.po.optional.some(po => po.recommendedSemester.includes(semester))
}

function poSemesterFilter(poId: string, semester: number) {
  return (m: MetadataAtomic) =>
    m.po.mandatory.some(po => po.po === poId && po.recommendedSemester.includes(semester)) ||
    m.po.optional.some(po => po.po === poId && po.recommendedSemester.includes(semester))
}

export const selectModuleTableRepresentation = createSelector(
  selectMetadataAtomic,
  selectModuleFilter,
  selectSelectedPOId,
  selectSelectedSemester,
  selectSelectedCoordinatorId,
  (
    modules,
    filter,
    poId,
    semester,
    coordinatorId
  ) => {
    const filters = [
      ...(poId && semester ? [poSemesterFilter(poId, semester)] : []),
      ...(poId && !semester ? [poFilter(poId)] : []),
      ...(!poId && semester ? [semesterFilter(semester)] : []),
      ...(coordinatorId ? [coordinatorFilter(coordinatorId)] : []),
      ...(filter ? [titleFilter(filter)] : []),
    ]

    return filters
      .reduce((xs, f) => xs.filter(f), modules)
      .map(m => toTableRepresentation(m, poId))
  }
)
