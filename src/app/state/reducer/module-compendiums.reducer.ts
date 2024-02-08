import { createReducer, on } from '@ngrx/store'
import { ModuleCompendiumsApiActions, ModuleCompendiumsPageActions } from '../actions/module-compendiums.actions'
import { Sort } from '@angular/material/sort'
import { ModuleCompendium } from "../../types/module-compendium";

export interface State {
  moduleCompendiums: ReadonlyArray<ModuleCompendium>
  moduleFilter?: string
  error?: string
  selectedSort?: Sort
}

const initialState: State = {
  moduleCompendiums: [],
  moduleFilter: undefined,
  error: undefined,
  selectedSort: undefined,
}

export const moduleCompendiumsReducer = createReducer(
  initialState,
  on(ModuleCompendiumsPageActions.enter, (state): State => {
    return {
      ...state,
      error: undefined,
    }
  }),
  on(ModuleCompendiumsPageActions.filterModuleCompendiums, (state, {filter}): State => {
    return {
      ...state,
      moduleFilter: filter,
    }
  }),
  on(ModuleCompendiumsPageActions.resetFilter, (state): State => {
    return {
      ...state,
      moduleFilter: undefined,
    }
  }),
  on(ModuleCompendiumsApiActions.retrievedModulesCompendiumsSuccess, (state, {moduleCompendiums}): State => {
    return {
      ...state,
      moduleCompendiums,
    }
  }),
  on(ModuleCompendiumsApiActions.retrievedModulesCompendiumsFailure, (state, {error}): State => {
    return {
      ...state,
      error,
    }
  }),
)
