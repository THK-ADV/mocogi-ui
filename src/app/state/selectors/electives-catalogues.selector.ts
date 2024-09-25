import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/electives-catalogs.reducer'

export const selectElectivesCatalogsState =
  createFeatureSelector<State>('electivesCatalogs')

export const selectElectivesCatalogs = createSelector(
  selectElectivesCatalogsState,
  (state) => state.electivesCatalogs,
)
