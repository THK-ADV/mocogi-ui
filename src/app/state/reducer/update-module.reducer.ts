import { createReducer, on } from '@ngrx/store'
import {
  UpdateModuleApiActions,
  UpdateModulePageActions,
} from '../actions/update-module-page.actions'

export interface State {
  error?: Error
  updateInProcess: boolean
}

const initialState: State = {
  error: undefined,
  updateInProcess: false,
}

export const updateModuleReducer = createReducer(
  initialState,
  on(UpdateModulePageActions.enter, (state): State => {
    return {
      ...state,
      updateInProcess: false,
    }
  }),
  on(UpdateModulePageActions.save, (state): State => {
    return {
      ...state,
      updateInProcess: true,
    }
  }),
  on(UpdateModulePageActions.cancel, (state): State => {
    return {
      ...state,
    }
  }),
  on(UpdateModuleApiActions.savedChangesSuccess, (state): State => {
    return {
      ...state,
      updateInProcess: false,
    }
  }),
  on(UpdateModuleApiActions.savedChangesFailure, (state, { error }): State => {
    return {
      ...state,
      error,
      updateInProcess: false,
    }
  }),
)
