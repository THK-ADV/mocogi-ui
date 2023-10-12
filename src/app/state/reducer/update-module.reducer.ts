import { createReducer, on } from '@ngrx/store'
import {UpdateModuleApiActions, UpdateModulePageActions} from '../actions/update-module-page.actions'

export interface State {
  error?: Error
}

const initialState: State = {
  error: undefined,
}

export const updateModuleReducer = createReducer(
  initialState,
  on(UpdateModulePageActions.enter, (state): State => {
    return {
      ...state,
    }
  }),
  on(UpdateModulePageActions.save, (state): State => {
    return {
      ...state,
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
    }
  }),
  on(UpdateModuleApiActions.savedChangesFailure, (state, { error}): State => {
    return {
      ...state,
      error,
    }
  }),
)
