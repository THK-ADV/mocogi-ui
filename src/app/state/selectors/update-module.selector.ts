import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/update-module.reducer'

const selectUpdateModuleState = createFeatureSelector<State>('updateModule')

export const selectUpdateInProcess = createSelector(
  selectUpdateModuleState,
  (state) => state.updateInProcess,
)
