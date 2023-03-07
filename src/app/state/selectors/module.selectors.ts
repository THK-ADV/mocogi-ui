import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module.reducer'
import { selectPeople, selectSelectedCoordinatorId, selectSelectedPOId, selectSelectedSemester } from './module-filter.selectors'
import { Metadata } from '../../types/metadata'
import { mapFilterUndefined } from '../../ops/array.ops'
import { Person } from '../../types/core/person'
import { toTableRepresentation } from '../../module/module-list/module-table-representation'

export type MetadataWithCoordinators = Omit<Metadata, 'moduleManagement'> & { moduleManagement: Person[] }

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

const selectModulesWithCoordinator = createSelector(
  selectModules,
  selectPeople,
  (modules, people) =>
    <MetadataWithCoordinators[]>modules.map(m => {
      const moduleManagement = mapFilterUndefined(m.moduleManagement, m => people.find(p => p.id === m))
      return {...m, moduleManagement}
    })
)

function titleFilter(filter: string) {
  filter = filter.trim().toLowerCase()
  return (m: MetadataWithCoordinators) =>
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
  return (m: MetadataWithCoordinators) =>
    m.moduleManagement.some(m => m.id === coordinatorId)
}

function poFilter(poId: string) {
  return (m: MetadataWithCoordinators) =>
    m.po.mandatory.some(po => po.po === poId) ||
    m.po.optional.some(po => po.po === poId)
}

function semesterFilter(semester: number) {
  return (m: MetadataWithCoordinators) =>
    m.po.mandatory.some(po => po.recommendedSemester.includes(semester)) ||
    m.po.optional.some(po => po.recommendedSemester.includes(semester))
}

function poSemesterFilter(poId: string, semester: number) {
  return (m: MetadataWithCoordinators) =>
    m.po.mandatory.some(po => po.po === poId && po.recommendedSemester.includes(semester)) ||
    m.po.optional.some(po => po.po === poId && po.recommendedSemester.includes(semester))
}

export const selectModuleTableRepresentation = createSelector(
  selectModulesWithCoordinator,
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
