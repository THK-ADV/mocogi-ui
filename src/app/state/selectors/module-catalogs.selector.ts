import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-catalogs.reducer'
import { selectSelectedStudyProgramId } from './module-compendiums-filter.selectors'

export const selectModuleCompendiumsState =
  createFeatureSelector<State>('moduleCatalogs')

export const selectModuleCompendiums = createSelector(
  selectModuleCompendiumsState,
  selectSelectedStudyProgramId,
  (state, studyProgramId) => {
    if (studyProgramId) {
      return state.moduleCatalogs.filter(
        (c) => c.studyProgram.id === studyProgramId,
      )
    }
    return state.moduleCatalogs
  },
)
