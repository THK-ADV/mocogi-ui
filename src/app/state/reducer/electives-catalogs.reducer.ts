import { createReducer, on } from '@ngrx/store'
import { Sort } from '@angular/material/sort'
import { ElectivesCatalogue } from '../../types/electivesCatalogues'
import { ElectivesCatalogsApiActions, ElectivesCatalogsPageActions } from '../actions/electives-catalogues.actions'

export interface State {
  electivesCatalogs: ReadonlyArray<ElectivesCatalogue>
  catalogsFilter?: string
  error?: string
  selectedSort?: Sort
}

const initialState: State = {
  electivesCatalogs: [],
  catalogsFilter: undefined,
  error: undefined,
  selectedSort: undefined,
}

export const electiveCatalogsReducer = createReducer(
  initialState,
  on(ElectivesCatalogsPageActions.enter, (state): State => {
    return {
      ...state,
      error: undefined,
    }
  }),
  on(ElectivesCatalogsPageActions.filterElectivesCatalogs, (state, {filter}): State => {
    return {
      ...state,
      catalogsFilter: filter,
    }
  }),
  on(ElectivesCatalogsPageActions.resetFilter, (state): State => {
    return {
      ...state,
      catalogsFilter: undefined,
    }
  }),
  on(ElectivesCatalogsApiActions.retrievedElectivesCatalogsSuccess, (state, {electivesCatalogues}): State => {
    return {
      ...state,
      electivesCatalogs: electivesCatalogues,
    }
  }),
  on(ElectivesCatalogsApiActions.retrievedElectivesCatalogsFailure, (state, {error}): State => {
    return {
      ...state,
      error,
    }
  }),
)
