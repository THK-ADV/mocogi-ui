import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-filter.reducer'

export const selectModuleFilterState = createFeatureSelector<State>('moduleFilter')

export const selectStudyPrograms = createSelector(
  selectModuleFilterState,
  (state) => state.studyPrograms,
)

export const selectSemester = createSelector(
  selectModuleFilterState,
  (state) => state.semester,
)

export const selectPeople = createSelector(
  selectModuleFilterState,
  (state) => state.people,
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
  selectPeople,
  selectSelectedCoordinatorId,
  (people, coordinatorId) => {
    if (!coordinatorId) {
      return undefined
    }
    return people.find(p => p.id === coordinatorId)
  },
)

export const selectSelectedStudyProgram = createSelector(
  selectStudyPrograms,
  selectSelectedStudyProgramId,
  (studyPrograms, studyProgramId) => {
    if (!studyProgramId) {
      return undefined
    }
    const {poId, specializationId} = studyProgramId
    return studyPrograms.find(({poAbbrev, specialization}) => {
      const selectedPo = poAbbrev === poId
      return specializationId
        ? selectedPo && specializationId === specialization?.abbrev
        : selectedPo
    })
  }
)
