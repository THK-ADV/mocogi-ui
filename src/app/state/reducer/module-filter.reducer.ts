import { createReducer, on } from '@ngrx/store'
import {
  ModuleFilterAPIActions,
  ModuleFilterPageActions,
} from '../actions/module-filter.actions'
import { Identity } from '../../types/core/person'
import { StudyProgram } from '../../types/module-compendium'

export interface SelectedStudyProgramId {
  poId: string
  specializationId: string | undefined
}

export interface State {
  studyPrograms: ReadonlyArray<StudyProgram>
  semester: ReadonlyArray<number>
  identities: Identity[]
  selectedStudyProgramId?: SelectedStudyProgramId
  selectedSemester?: number
  selectedCoordinatorId?: string
}

const initialState: State = {
  studyPrograms: [],
  identities: [],
  semester: [1, 2, 3, 4, 5, 6, 7],
  selectedStudyProgramId: undefined,
  selectedSemester: undefined,
  selectedCoordinatorId: undefined,
}

export const moduleFilterReducer = createReducer(
  initialState,
  on(ModuleFilterPageActions.enter, (state): State => {
    return state
  }),
  on(
    ModuleFilterPageActions.selectStudyProgram,
    (state, { selectedStudyProgramId }): State => {
      return {
        ...state,
        selectedStudyProgramId,
      }
    },
  ),
  on(ModuleFilterPageActions.selectSemester, (state, { semester }): State => {
    return {
      ...state,
      selectedSemester: semester,
    }
  }),
  on(
    ModuleFilterPageActions.selectCoordinator,
    (state, { coordinatorId }): State => {
      return {
        ...state,
        selectedCoordinatorId: coordinatorId,
      }
    },
  ),
  on(ModuleFilterPageActions.resetFilter, (state): State => {
    return {
      ...state,
      selectedStudyProgramId: undefined,
      selectedSemester: undefined,
      selectedCoordinatorId: undefined,
    }
  }),
  on(ModuleFilterPageActions.deselectStudyProgram, (state): State => {
    return {
      ...state,
      selectedStudyProgramId: undefined,
    }
  }),
  on(ModuleFilterPageActions.deselectSemester, (state): State => {
    return {
      ...state,
      selectedSemester: undefined,
    }
  }),
  on(ModuleFilterPageActions.deselectCoordinator, (state): State => {
    return {
      ...state,
      selectedCoordinatorId: undefined,
    }
  }),
  on(
    ModuleFilterAPIActions.retrievedStudyProgramsSuccess,
    (state, { studyPrograms }): State => {
      return {
        ...state,
        studyPrograms,
      }
    },
  ),
  on(
    ModuleFilterAPIActions.retrievedIdentitiesSuccess,
    (state, { identities }): State => {
      return {
        ...state,
        identities,
      }
    },
  ),
)
