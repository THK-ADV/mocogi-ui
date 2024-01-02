import { createReducer, on } from '@ngrx/store'
import { Person } from '../../types/core/person'

import { StudyProgramAtomic } from '../../types/study-program-atomic'
import { SemesterAtomic } from "../../types/core/semester";
import { ModuleCompendiumsFilterActions } from "../actions/module-compendium-filter.actions";

export interface State {
  studyPrograms: ReadonlyArray<StudyProgramAtomic>
  semester: ReadonlyArray<SemesterAtomic>
  people: Person[]
  selectedStudyProgramId?: SelectedStudyProgramId
  selectedSemester?: SemesterAtomic
  selectedCoordinatorId?: string
}

const initialState: State = {
  studyPrograms: [],
  people: [],
  semester: [],
  selectedStudyProgramId: undefined,
  selectedSemester: undefined,
  selectedCoordinatorId: undefined,
}

export const moduleFilterReducer = createReducer(
  initialState,
  on(ModuleCompendiumsFilterActions.enter, (state): State => {
    return state
  }),
  on(ModuleCompendiumsFilterActions.selectStudyProgram, (state, {selectedStudyProgramId}): State => {
    return {
      ...state,
      selectedStudyProgramId,
    }
  }),
  on(ModuleCompendiumsFilterActions.selectSemester, (state, {semester}): State => {
    return {
      ...state,
      selectedSemester: semester,
    }
  }),
  on(ModuleCompendiumsFilterActions.selectCoordinator, (state, {coordinatorId}): State => {
    return {
      ...state,
      selectedCoordinatorId: coordinatorId,
    }
  }),
  on(ModuleCompendiumsFilterActions.resetFilter, (state): State => {
    return {
      ...state,
      selectedStudyProgramId: undefined,
      selectedSemester: undefined,
      selectedCoordinatorId: undefined,
    }
  }),
  on(ModuleCompendiumsFilterActions.deselectStudyProgram, (state): State => {
    return {
      ...state,
      selectedStudyProgramId: undefined,
    }
  }),
  on(ModuleCompendiumsFilterActions.deselectSemester, (state): State => {
    return {
      ...state,
      selectedSemester: undefined,
    }
  }),
  on(ModuleCompendiumsFilterActions.deselectCoordinator, (state): State => {
    return {
      ...state,
      selectedCoordinatorId: undefined,
    }
  })
)
