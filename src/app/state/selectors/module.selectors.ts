import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module.reducer'
import { selectSelectedCoordinatorId, selectSelectedSemester, selectSelectedStudyProgramId } from './module-filter.selectors'
import { ModuleAtomic, StudyProgramModuleAssociation } from '../../types/module-atomic'
import { toModuleTableEntry } from '../../module/module-list/module-table-entry'
import { SelectedStudyProgramId } from '../reducer/module-filter.reducer'

export const selectModuleState = createFeatureSelector<State>('module')

const selectModules_ = createSelector(
  selectModuleState,
  (state) => state.modules,
)

export const selectModuleFilter = createSelector(
  selectModuleState,
  (state) => state.moduleFilter,
)

export const selectSelectedSort = createSelector(
  selectModuleState,
  (state) => state.selectedSort,
)

function titleFilter(filter: string) {
  filter = filter.trim().toLowerCase()
  return (m: ModuleAtomic) =>
    m.title.toLowerCase().includes(filter) ||
    m.abbrev.toLowerCase().includes(filter) ||
    m.moduleManagement.some(p => {
        switch (p.kind) {
          case 'single':
            return p.abbrev.toLowerCase().includes(filter) ||
              p.lastname.toLowerCase().includes(filter) ||
              p.firstname.toLowerCase().includes(filter)
          default:
            return p.title.toLowerCase().includes(filter)
        }
      },
    )
}


function coordinatorFilter(coordinatorId: string) {
  return (m: ModuleAtomic) =>
    m.moduleManagement.some(p => p.id === coordinatorId)
}

function checkStudyProgram({poId, specializationId}: SelectedStudyProgramId, sp: StudyProgramModuleAssociation): boolean {
  if (specializationId) {
    return sp.specialization?.abbrev === specializationId // take modules from the specialization
      || (sp.poAbbrev === poId && !sp.specialization) // plus all mandatory modules from the sp without the specialization
  }
  return !sp.specialization && sp.poAbbrev === poId
}

function checkSemester(semester: number, sp: StudyProgramModuleAssociation): boolean {
  return sp.recommendedSemester.includes(semester)
}

function studyProgramFilter(selectedStudyProgramId: SelectedStudyProgramId) {
  return (m: ModuleAtomic) =>
    m.studyProgram.some(sp => checkStudyProgram(selectedStudyProgramId, sp))
}

function semesterFilter(semester: number) {
  return (m: ModuleAtomic) =>
    m.studyProgram.some(sp => checkSemester(semester, sp))
}

function studyProgramSemesterFilter(selectedStudyProgramId: SelectedStudyProgramId, semester: number) {
  return (m: ModuleAtomic) =>
    m.studyProgram.some(po => checkStudyProgram(selectedStudyProgramId, po) && checkSemester(semester, po))
}

export const selectModules = createSelector(
  selectModules_,
  selectModuleFilter,
  selectSelectedStudyProgramId,
  selectSelectedSemester,
  selectSelectedCoordinatorId,
  (
    modules,
    filter,
    studyProgramId,
    semester,
    coordinatorId,
  ) => {
    const filters = [
      ...(studyProgramId && semester ? [studyProgramSemesterFilter(studyProgramId, semester)] : []),
      ...(studyProgramId && !semester ? [studyProgramFilter(studyProgramId)] : []),
      ...(!studyProgramId && semester ? [semesterFilter(semester)] : []),
      ...(coordinatorId ? [coordinatorFilter(coordinatorId)] : []),
      ...(filter ? [titleFilter(filter)] : []),
    ]

    return filters
      .reduce((xs, f) => xs.filter(f), modules)
      .map(m => toModuleTableEntry(m, studyProgramId))
  }
)
