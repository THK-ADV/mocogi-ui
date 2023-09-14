import { createReducer, on } from '@ngrx/store'
import { Module } from 'src/app/types/module'
import { ModuleDraft } from 'src/app/types/module-draft'
import { MyModulesApiActions, MyModulesPageActions } from '../actions/my-modules.action'

export interface State {
  modules: ReadonlyArray<Module>
  moduleDrafts: ReadonlyArray<ModuleDraft>
  error?: Error
}

const initialState: State = {
  modules: [],
  moduleDrafts: [],
  error: undefined,
}

export const myModulesReducer = createReducer(
  initialState,
  on(MyModulesPageActions.enter, (state): State => {
    return {
      ...state,
    }
  }),
  on(MyModulesApiActions.retrievedModulesSuccess, (state, {modules}): State => {
    return {
      ...state,
      modules,
    }
  }),
  on(MyModulesApiActions.retrievedModuleDraftsSuccess, (state, {moduleDrafts}): State => {
    return {
      ...state,
      moduleDrafts,
    }
  }),
  on(MyModulesApiActions.retrievedError, (state, {error}): State => {
    return {
      ...state,
      error,
    }
  }),
)
