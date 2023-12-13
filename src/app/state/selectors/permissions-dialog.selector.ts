import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/permissions-dialog.reducer'

const selectPermissionsState = createFeatureSelector<State>('permissionDialog')

export const selectPermissions = createSelector(
  selectPermissionsState,
  (state) => state.permissions,
)
