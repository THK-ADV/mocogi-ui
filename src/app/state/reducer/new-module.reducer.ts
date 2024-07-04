import { createReducer, on } from '@ngrx/store'
import { NewModuleApiActions, NewModulePageActions } from '../actions/new-module-page.actions'

export interface State {
  updateInProcess: boolean,
}

const initialState: State = {
  updateInProcess: false,
}

export const newModuleReducer = createReducer(
  initialState,
  on(NewModulePageActions.enter, (state): State => {
    return {
      ...state,
      updateInProcess: false,
    }
  }),
  on(NewModulePageActions.save, (state): State => {
    return {
      ...state,
      updateInProcess: true,
    }
  }),
  on(NewModuleApiActions.savedChangesSuccess, (state): State => {
    return {
      ...state,
      updateInProcess: false,
    }
  }),
  on(NewModuleApiActions.savedChangesFailure, (state): State => {
    return {
      ...state,
      updateInProcess: false,
    }
  }),
)
