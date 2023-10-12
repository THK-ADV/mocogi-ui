import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/my-modules.reducer'

const selectMyModulesState = createFeatureSelector<State>('myModules')

export const selectModeratedModules = createSelector(
  selectMyModulesState,
  (state) => state.moderatedModules,
)
