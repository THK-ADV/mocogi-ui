import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-compendiums.reducer'
import { ModuleAtomic, StudyProgramModuleAssociation } from '../../types/module-atomic'
import { SelectedStudyProgramId } from '../reducer/module-filter.reducer'

export const selectModuleCompendiumsState = createFeatureSelector<State>('module-compendiums')

export const selectModuleCompendiums = createSelector(
  selectModuleCompendiumsState,
  (state) => state.moduleCompendiums,
)

export const selectModuleCompendiumsFilter = createSelector(
  selectModuleCompendiumsState,
  (state) => state.moduleFilter,
)

export const selectSelectedSort = createSelector(
  selectModuleCompendiumsState,
  (state) => state.selectedSort,
)

function titleFilter(filter: string) {
  filter = filter.trim().toLowerCase()
  return (m: ModuleAtomic) =>
    m.title.toLowerCase().includes(filter) ||
    m.abbrev.toLowerCase().includes(filter) ||
    m.moduleManagement.some(p => {
        switch (p.kind) {
          case 'default':
            return p.abbrev.toLowerCase().includes(filter) ||
              p.lastname.toLowerCase().includes(filter) ||
              p.firstname.toLowerCase().includes(filter)
          default:
            return p.title.toLowerCase().includes(filter)
        }
      },
    )
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
