import { createReducer, on } from '@ngrx/store'
import {
  ModuleCompendiumsFilterAPIActions,
  ModuleCompendiumsFilterComponentActions,
} from '../actions/module-compendiums-filter.actions'
import { Semester, StudyProgramCore } from '../../types/module-compendium'
import { generateCurrentSemester } from '../../helper/semester.helper'

export interface State {
  studyPrograms: ReadonlyArray<StudyProgramCore>
  semesters: ReadonlyArray<Semester>
  selectedStudyProgramId?: string
  selectedSemester?: Semester
}

const initialState: State = {
  studyPrograms: [],
  semesters: [],
  selectedStudyProgramId: undefined,
  selectedSemester: undefined,
}

export const moduleCompendiumsFilterReducer = createReducer(
  initialState,
  on(ModuleCompendiumsFilterComponentActions.enter, (state): State => {
    return state
  }),
  on(
    ModuleCompendiumsFilterComponentActions.selectStudyProgram,
    (state, { selectedStudyProgramId }): State => {
      return {
        ...state,
        selectedStudyProgramId,
      }
    },
  ),
  on(
    ModuleCompendiumsFilterComponentActions.selectSemester,
    (state, { semester }): State => {
      return {
        ...state,
        selectedSemester: semester,
      }
    },
  ),
  on(ModuleCompendiumsFilterComponentActions.resetFilter, (state): State => {
    return {
      ...state,
      selectedStudyProgramId: undefined,
    }
  }),
  on(
    ModuleCompendiumsFilterComponentActions.deselectStudyProgram,
    (state): State => {
      return {
        ...state,
        selectedStudyProgramId: undefined,
      }
    },
  ),
  on(
    ModuleCompendiumsFilterComponentActions.deselectSemester,
    (state): State => {
      return {
        ...state,
        selectedSemester: generateCurrentSemester(),
      }
    },
  ),
  on(
    ModuleCompendiumsFilterAPIActions.retrievedStudyProgramsSuccess,
    (state, { studyPrograms }): State => {
      return {
        ...state,
        studyPrograms,
      }
    },
  ),
  on(
    ModuleCompendiumsFilterAPIActions.retrievedSemestersSuccess,
    (state, { semesters }): State => {
      return {
        ...state,
        semesters,
        selectedSemester: generateCurrentSemester(),
      }
    },
  ),
)
