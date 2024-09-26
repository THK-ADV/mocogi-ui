import { createReducer, on } from '@ngrx/store'
import { Semester } from '../../types/module-compendium'
import { generateCurrentSemester } from '../../helper/semester.helper'
import {
  ElectivesCatalogsFilterAPIActions,
  ElectivesCatalogsFilterComponentActions,
} from '../actions/electives-catalogs-filter.actions'

export interface State {
  semesters: ReadonlyArray<Semester>
  selectedSemester?: Semester
}

const initialState: State = {
  semesters: [],
  selectedSemester: undefined,
}

export const electivesCatalogsFilterReducer = createReducer(
  initialState,
  on(ElectivesCatalogsFilterComponentActions.enter, (state): State => {
    return state
  }),
  on(
    ElectivesCatalogsFilterComponentActions.selectSemester,
    (state, { semester }): State => {
      return {
        ...state,
        selectedSemester: semester,
      }
    },
  ),
  on(ElectivesCatalogsFilterComponentActions.resetFilter, (state): State => {
    return {
      ...state,
    }
  }),
  on(
    ElectivesCatalogsFilterComponentActions.deselectSemester,
    (state): State => {
      return {
        ...state,
        selectedSemester: generateCurrentSemester(),
      }
    },
  ),
  on(
    ElectivesCatalogsFilterAPIActions.retrievedSemestersSuccess,
    (state, { semesters }): State => {
      return {
        ...state,
        semesters,
        selectedSemester: generateCurrentSemester(),
      }
    },
  ),
)
