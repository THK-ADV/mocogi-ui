import { createReducer, on } from '@ngrx/store'
import { ModuleApiActions, ModulePageActions } from '../actions/module.actions'
import { Sort } from '@angular/material/sort'
import { ModuleAtomic } from '../../types/module-atomic'

export interface State {
  modules: ModuleAtomic[]
  selectedModuleId?: string
  moduleFilter?: string
  error?: Error
  selectedSort?: Sort
}

const initialState: State = {
  modules: [],
  selectedModuleId: undefined,
  moduleFilter: undefined,
  error: undefined,
  selectedSort: undefined,
}

export const moduleReducer = createReducer(
  initialState,
  on(ModulePageActions.enter, (state): State => {
    return {
      ...state,
      error: undefined,
      selectedModuleId: undefined,
    }
  }),
  on(ModulePageActions.selectModule, (state, {moduleId}): State => {
    return {
      ...state,
      selectedModuleId: moduleId,
    }
  }),
  on(ModulePageActions.filterModule, (state, {filter}): State => {
    return {
      ...state,
      moduleFilter: filter,
    }
  }),
  on(ModulePageActions.resetFilter, (state): State => {
    return {
      ...state,
      moduleFilter: undefined,
    }
  }),
  on(ModulePageActions.selectSort, (state, {sort}): State => {
    return {
      ...state,
      selectedSort: sort,
    }
  }),
  on(ModuleApiActions.retrievedModulesSuccess, (state, {modules}): State => {
    return {
      ...state,
      modules,
    }
  }),
  on(ModuleApiActions.retrievedModulesFailure, (state, {error}): State => {
    return {
      ...state,
      error,
    }
  }),
)
