import { createReducer, on } from '@ngrx/store'
import { ModuleCatalogsApiActions, ModuleCatalogsPageActions } from '../actions/module-catalogs.actions'
import { Sort } from '@angular/material/sort'
import { ModuleCatalog } from '../../types/module-compendium'

export interface State {
  moduleCatalogs: ReadonlyArray<ModuleCatalog>
  moduleFilter?: string
  error?: string
  selectedSort?: Sort
}

const initialState: State = {
  moduleCatalogs: [],
  moduleFilter: undefined,
  error: undefined,
  selectedSort: undefined,
}

export const moduleCatalogsReducer = createReducer(
  initialState,
  on(ModuleCatalogsPageActions.enter, (state): State => {
    return {
      ...state,
      error: undefined,
    }
  }),
  on(ModuleCatalogsPageActions.filterModuleCatalogs, (state, {filter}): State => {
    return {
      ...state,
      moduleFilter: filter,
    }
  }),
  on(ModuleCatalogsPageActions.resetFilter, (state): State => {
    return {
      ...state,
      moduleFilter: undefined,
    }
  }),
  on(ModuleCatalogsApiActions.retrievedModulesCatalogsSuccess, (state, { moduleCatalogs }): State => {
    return {
      ...state,
      moduleCatalogs: moduleCatalogs,
    }
  }),
  on(ModuleCatalogsApiActions.retrievedModulesCatalogsFailure, (state, {error}): State => {
    return {
      ...state,
      error,
    }
  }),
)
