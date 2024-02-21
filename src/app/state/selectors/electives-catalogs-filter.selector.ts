import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-compendiums-filter.reducer'

export const selectElectivesCatalogsFilterState = createFeatureSelector<State>('electivesCatalogsFilter')

export const selectSemesters = createSelector(
  selectElectivesCatalogsFilterState,
  (state) => state.semesters,
)

export const selectSelectedSemester = createSelector(
  selectElectivesCatalogsFilterState,
  (state) => state.selectedSemester,
)
