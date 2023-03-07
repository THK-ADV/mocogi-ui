import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-filter.reducer'
import { PO } from '../../types/core/po'
import { StudyProgram } from '../../types/core/study-program'
import { Grade } from '../../types/core/grade'
import { mapFilterUndefined } from '../../ops/array.ops'
import { studyProgramWithPOOrd } from '../../ops/ordering.instances'

export type StudyProgramWithPO = [PO, StudyProgram, Grade]

export const selectModuleFilterState = createFeatureSelector<State>('moduleFilter')

export const selectStudyPrograms = createSelector(
  selectModuleFilterState,
  (state) => state.studyPrograms
)

export const selectSemester = createSelector(
  selectModuleFilterState,
  (state) => state.semester
)

export const selectPOs = createSelector(
  selectModuleFilterState,
  (state) => state.pos
)

export const selectGrades = createSelector(
  selectModuleFilterState,
  (state) => state.grades
)

export const selectPeople = createSelector(
  selectModuleFilterState,
  (state) => state.people
)

export const selectSelectedPOId = createSelector(
  selectModuleFilterState,
  (state) => state.selectedPOId
)

export const selectSelectedSemester = createSelector(
  selectModuleFilterState,
  (state) => state.selectedSemester
)

export const selectSelectedCoordinatorId = createSelector(
  selectModuleFilterState,
  (state) => state.selectedCoordinatorId
)

export const selectSelectedCoordinator = createSelector(
  selectPeople,
  selectSelectedCoordinatorId,
  (people, coordinatorId) => {
    if (!coordinatorId) {
      return undefined
    }
    return people.find(p => p.id === coordinatorId)
  }
)

export const selectStudyProgramWithPO = createSelector(
  selectStudyPrograms,
  selectPOs,
  selectGrades,
  (sps, pos, grades) => {
    if (sps.length === 0 || pos.length === 0) {
      return []
    }
    const result: StudyProgramWithPO[] = mapFilterUndefined(pos, po => {
      const sp = sps.find(sp => sp.abbrev === po?.program)
      const g = grades.find(g => g.abbrev === sp?.grade)
      return sp && g ? [po, sp, g] : undefined
    })
    return result.sort(studyProgramWithPOOrd)
  }
)

export const selectSelectedStudyProgramWithPO = createSelector(
  selectStudyProgramWithPO,
  selectSelectedPOId,
  (spWithPos, poId) => {
    if (!poId) {
      return undefined
    }
    return spWithPos.find(([po]) => po.abbrev === poId)
  }
)
