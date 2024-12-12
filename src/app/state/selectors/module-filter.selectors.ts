import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-filter.reducer'
import { isStudyProgram } from '../../helper/study-program.helper'

export const selectModuleFilterState =
  createFeatureSelector<State>('moduleFilter')

export const selectStudyPrograms = createSelector(
  selectModuleFilterState,
  (state) => state.studyPrograms,
)

export const selectSemester = createSelector(
  selectModuleFilterState,
  (state) => state.semester,
)

export const selectIdentities = createSelector(
  selectModuleFilterState,
  (state) => state.identities,
)

export const selectSelectedStudyProgramId = createSelector(
  selectModuleFilterState,
  (state) => state.selectedStudyProgramId,
)

export const selectSelectedSemester = createSelector(
  selectModuleFilterState,
  (state) => state.selectedSemester,
)

export const selectSelectedCoordinatorId = createSelector(
  selectModuleFilterState,
  (state) => state.selectedCoordinatorId,
)

export const selectSelectedCoordinator = createSelector(
  selectIdentities,
  selectSelectedCoordinatorId,
  (people, coordinatorId) => {
    if (!coordinatorId) {
      return undefined
    }
    return people.find((p) => p.id === coordinatorId)
  },
)

export const selectSelectedStudyProgram = createSelector(
  selectStudyPrograms,
  selectSelectedStudyProgramId,
  (studyPrograms, studyProgramId) => {
    if (!studyProgramId) {
      return undefined
    }
    return studyPrograms.find((sp) =>
      isStudyProgram(sp, studyProgramId.poId, studyProgramId.specializationId),
    )
  },
)
