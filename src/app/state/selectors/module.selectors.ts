import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module.reducer'
import {
  FullStudyProgram,
  selectGrades,
  selectPeople,
  selectPOs,
  selectSelectedCoordinatorId,
  selectSelectedSemester,
  selectSelectedStudyProgramId,
  selectStudyPrograms
} from './module-filter.selectors'
import { Metadata } from '../../types/metadata'
import { mapFilterUndefined } from '../../ops/array.ops'
import { Person } from '../../types/core/person'
import { toTableRepresentation } from '../../module/module-list/module-table-representation'
import { SelectedStudyProgramId } from '../reducer/module-filter.reducer'
import { POMandatory, POOptional } from '../../types/pos'

export type POMandatoryAtomic = {
  po: FullStudyProgram,
  recommendedSemester: ReadonlyArray<number>,
  recommendedSemesterPartTime: ReadonlyArray<number>
}

export type MetadataAtomic =
  Omit<Metadata, 'moduleManagement'> & {
  moduleManagement: ReadonlyArray<Person>,
  poMandatoryAtomic: ReadonlyArray<POMandatoryAtomic>
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
      const poMandatoryAtomic: POMandatoryAtomic[] = mapFilterUndefined(m.po.mandatory, poMandatory => {
        const po = pos.find(po => po.abbrev === poMandatory.po)
        const studyProgram = studyPrograms.find(sp => sp.abbrev === po?.program)
        const grade = grades.find(g => g.abbrev === studyProgram?.grade)
        return po && studyProgram && grade && {...poMandatory, po: {studyProgram, po, grade, specialization: undefined}}
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

function checkPO({poId, specializationId}: SelectedStudyProgramId, po: POMandatory | POOptional): boolean {
  if (specializationId) {
    return po.specialization === specializationId // take modules from the specialization
      || (po.po === poId && !po.specialization) // plus all mandatory modules from the po without the specialization
  }
  return !po.specialization && po.po === poId
}

function checkSemester(semester: number, po: POMandatory | POOptional): boolean {
  return po.recommendedSemester.includes(semester)
}

function poFilter(selectedStudyProgramId: SelectedStudyProgramId) {
  return (m: MetadataAtomic) =>
    m.po.mandatory.some(po => checkPO(selectedStudyProgramId, po)) ||
    m.po.optional.some(po => checkPO(selectedStudyProgramId, po))
}

function semesterFilter(semester: number) {
  return (m: MetadataAtomic) =>
    m.po.mandatory.some(po => checkSemester(semester, po)) ||
    m.po.optional.some(po => checkSemester(semester, po))
}

function poSemesterFilter(selectedStudyProgramId: SelectedStudyProgramId, semester: number) {
  return (m: MetadataAtomic) =>
    m.po.mandatory.some(po => checkPO(selectedStudyProgramId, po) && checkSemester(semester, po)) ||
    m.po.optional.some(po => checkPO(selectedStudyProgramId, po) && checkSemester(semester, po))
}

export const selectModuleTableRepresentation = createSelector(
  selectMetadataAtomic,
  selectModuleFilter,
  selectSelectedStudyProgramId,
  selectSelectedSemester,
  selectSelectedCoordinatorId,
  (
    modules,
    filter,
    studyProgramId,
    semester,
    coordinatorId
  ) => {
    const filters = [
      ...(studyProgramId && semester ? [poSemesterFilter(studyProgramId, semester)] : []),
      ...(studyProgramId && !semester ? [poFilter(studyProgramId)] : []),
      ...(!studyProgramId && semester ? [semesterFilter(semester)] : []),
      ...(coordinatorId ? [coordinatorFilter(coordinatorId)] : []),
      ...(filter ? [titleFilter(filter)] : []),
    ]

    return filters
      .reduce((xs, f) => xs.filter(f), modules)
      .map(m => toTableRepresentation(m, studyProgramId))
  }
)
