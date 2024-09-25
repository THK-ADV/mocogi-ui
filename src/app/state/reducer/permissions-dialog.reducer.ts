import { createReducer, on } from '@ngrx/store'
import {
  PermissionsDialogActions,
  PermissionsDialogApiActions,
} from '../actions/permissions-dialog.actions'

export interface State {
  permissions: ReadonlyArray<string>
  error?: Error
}

const initialState: State = {
  permissions: [],
  error: undefined,
}

export const permissionsDialogReducer = createReducer(
  initialState,
  on(PermissionsDialogActions.enter, (state): State => {
    return {
      ...state,
    }
  }),
  on(PermissionsDialogActions.cancel, (state): State => {
    return {
      ...state,
    }
  }),
  on(PermissionsDialogActions.add, (state, { campusId }): State => {
    return {
      ...state,
      permissions: Array.from(new Set([...state.permissions, campusId])),
    }
  }),
  on(PermissionsDialogActions.remove, (state, { campusId }): State => {
    return {
      ...state,
      permissions: state.permissions.filter(
        (campusIdFromList) => campusIdFromList !== campusId,
      ),
    }
  }),
  on(
    PermissionsDialogActions.edit,
    (state, { newValue, changedCampusId }): State => {
      return {
        ...state,
        permissions: state.permissions.map((campusId) =>
          campusId === changedCampusId ? newValue : campusId,
        ),
      }
    },
  ),
  on(
    PermissionsDialogApiActions.receivedPermissionsSuccessfully,
    (state, { permissions }): State => {
      return {
        ...state,
        permissions,
      }
    },
  ),
)
