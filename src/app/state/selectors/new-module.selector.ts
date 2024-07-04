import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/new-module.reducer'

const selectNewModuleState = createFeatureSelector<State>('newModule')

export const selectUpdateInProcess = createSelector(
  selectNewModuleState,
  (state) => state.updateInProcess,
)
