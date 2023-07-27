import { StudyProgram } from '../../types/core/study-program'
import { createReducer, on } from '@ngrx/store'
import { ModuleFilterAPIActions, ModuleFilterPageActions } from '../actions/module-filter.actions'
import { PO } from '../../types/core/po'
import { Grade } from '../../types/core/grade'
import { Person } from '../../types/core/person'
import { Specialization } from '../../types/specialization'

export interface SelectedStudyProgramId {
  poId: string
  specializationId: string | undefined
}

export interface State {
  studyPrograms: ReadonlyArray<StudyProgram>
  pos: ReadonlyArray<PO>
  grades: ReadonlyArray<Grade>
  semester: number[]
  people: Person[]
  specializations: ReadonlyArray<Specialization>
  selectedStudyProgramId?: SelectedStudyProgramId
  selectedSemester?: number
  selectedCoordinatorId?: string
}

const initialState: State = {
  studyPrograms: [],
  pos: [],
  grades: [],
  people: [],
  specializations: [],
  semester: [1, 2, 3, 4, 5, 6],
  selectedStudyProgramId: undefined,
  selectedSemester: undefined,
  selectedCoordinatorId: undefined,
}

export const moduleFilterReducer = createReducer(
  initialState,
  on(ModuleFilterPageActions.enter, (state): State => {
    return state
  }),
  on(ModuleFilterPageActions.selectStudyprogram, (state, {selectedStudyProgramId}): State => {
    return {
      ...state,
      selectedStudyProgramId,
    }
  }),
  on(ModuleFilterPageActions.selectSemester, (state, {semester}): State => {
    return {
      ...state,
      selectedSemester: semester,
    }
  }),
  on(ModuleFilterPageActions.selectCoordinator, (state, {coordinatorId}): State => {
    return {
      ...state,
      selectedCoordinatorId: coordinatorId,
    }
  }),
  on(ModuleFilterPageActions.resetFilter, (state): State => {
    return {
      ...state,
      selectedStudyProgramId: undefined,
      selectedSemester: undefined,
      selectedCoordinatorId: undefined,
    }
  }),
  on(ModuleFilterPageActions.deselectStudyprogram, (state): State => {
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
  on(ModuleFilterAPIActions.retrievedStudyprogramsSuccess, (state, {studyPrograms}): State => {
    return {
      ...state,
      studyPrograms,
    }
  }),
  on(ModuleFilterAPIActions.retrievedPosSuccess, (state, {pos}): State => {
    return {
      ...state,
      pos,
    }
  }),
  on(ModuleFilterAPIActions.retrievedGradesSuccess, (state, {grades}): State => {
    return {
      ...state,
      grades,
    }
  }),
  on(ModuleFilterAPIActions.retrievedPeopleSuccess, (state, {people}): State => {
    return {
      ...state,
      people,
    }
  }),
  on(ModuleFilterAPIActions.retrievedSpecializationsSuccess, (state, {specializations}): State => {
    return {
      ...state,
      specializations,
    }
  }),
)
