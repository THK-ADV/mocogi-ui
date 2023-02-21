import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-filter.reducer'
import { PO } from '../../types/core/po'
import { StudyProgram } from '../../types/core/study-program'
import { Grade } from '../../types/core/grade'
import { numberOrd, Ordering, stringOrd } from '../../ops/ordering'

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

const poOrd: Ordering<PO> = Ordering.contraMap(numberOrd, po => po.version)

const studyProgramOrd: Ordering<StudyProgram> = Ordering.contraMap(stringOrd, sp => sp.deLabel)

const gradeOrd: Ordering<Grade> = Ordering.contraMap(stringOrd, g => g.abbrev)

const orderings = Ordering.many<[PO, StudyProgram, Grade]>([
  Ordering.contraMap(studyProgramOrd, ([, sp,]) => sp),
  Ordering.contraMap(poOrd, ([po, ,]) => po),
  Ordering.contraMap(gradeOrd, ([, , g]) => g)
])

export const selectStudyProgramWithPO = createSelector(
  selectStudyPrograms,
  selectPOs,
  selectGrades,
  (sps, pos, grades) => {
    if (sps.length === 0 || pos.length === 0) {
      return []
    }
    const result: Array<[PO, StudyProgram, Grade]> = []
    for (const po of pos) {
      const sp = sps.find(sp => sp.abbrev === po.program)
      if (sp) {
        const g = grades.find(g => g.abbrev === sp.grade)
        if (g) {
          result.push([po, sp, g])
        }
      }
    }
    return result.sort(orderings)
  }
)

export const selectSelectedStudyProgramWithPO = createSelector(
  selectStudyProgramWithPO,
  selectSelectedPOId,
  (spWithPos, poId) => {
    if (!poId) {
      return undefined
    }
    return spWithPos.find((spWithPo) => {
      const [po,] = spWithPo
      return po.abbrev === poId
    })
  }
)
