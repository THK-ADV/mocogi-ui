import { createReducer, on } from '@ngrx/store'
import { Sort } from '@angular/material/sort'
import { ElectivesCatalogue } from "../../types/electivesCatalogues";
import { ElectivesCataloguesApiActions, ElectivesCataloguesPageActions } from "../actions/electives-catalogues.actions";

export interface State {
  electivesCatalogues: ReadonlyArray<ElectivesCatalogue>
  cataloguesFilter?: string
  error?: string
  selectedSort?: Sort
}

const initialState: State = {
  electivesCatalogues: [],
  cataloguesFilter: undefined,
  error: undefined,
  selectedSort: undefined,
}

export const electiveCataloguesReducer = createReducer(
  initialState,
  on(ElectivesCataloguesPageActions.enter, (state): State => {
    return {
      ...state,
      error: undefined,
    }
  }),
  on(ElectivesCataloguesPageActions.filterElectivesCatalogues, (state, {filter}): State => {
    return {
      ...state,
      cataloguesFilter: filter,
    }
  }),
  on(ElectivesCataloguesPageActions.resetFilter, (state): State => {
    return {
      ...state,
      cataloguesFilter: undefined,
    }
  }),
  on(ElectivesCataloguesApiActions.retrievedElectivesCataloguesSuccess, (state, {electivesCatalogues}): State => {
    return {
      ...state,
      electivesCatalogues,
    }
  }),
  on(ElectivesCataloguesApiActions.retrievedElectivesCataloguesFailure, (state, {error}): State => {
    return {
      ...state,
      error,
    }
  }),
)
