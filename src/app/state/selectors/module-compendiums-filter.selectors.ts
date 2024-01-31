import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-compendiums-filter.reducer'

export const selectModuleCompendiumsFilterState = createFeatureSelector<State>('moduleCompendiumsFilter')

export const selectStudyPrograms = createSelector(
  selectModuleCompendiumsFilterState,
  (state) => state.studyPrograms,
)

export const selectSemesters = createSelector(
  selectModuleCompendiumsFilterState,
  (state) => state.semesters,
)

export const selectSelectedStudyProgramId = createSelector(
  selectModuleCompendiumsFilterState,
  (state) => state.selectedStudyProgramId,
)

export const selectSelectedSemester = createSelector(
  selectModuleCompendiumsFilterState,
  (state) => state.selectedSemester,
)
export const selectSelectedStudyProgram = createSelector(
  selectStudyPrograms,
  selectSelectedStudyProgramId,
  (studyPrograms, studyProgramId) => {
    if (!studyProgramId) {
      return undefined
    }
    studyPrograms.find((sp) => sp.abbrev === studyProgramId )
  }
)
