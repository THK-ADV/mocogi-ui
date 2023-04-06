import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-filter.reducer'
import { PO } from '../../types/core/po'
import { StudyProgram } from '../../types/core/study-program'
import { Grade } from '../../types/core/grade'
import { fullStudyProgramOrd } from '../../ops/ordering.instances'
import { Specialization } from '../../types/specialization'

export interface FullStudyProgram {
  po: PO
  studyProgram: StudyProgram
  grade: Grade
  specialization?: Specialization
}

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

export const selectSpecializations = createSelector(
  selectModuleFilterState,
  (state) => state.specializations
)

export const selectSelectedStudyProgramId = createSelector(
  selectModuleFilterState,
  (state) => state.selectedStudyProgramId
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

export const selectFullStudyProgram = createSelector(
  selectStudyPrograms,
  selectPOs,
  selectGrades,
  selectSpecializations,
  (sps, pos, grades, specializations) => {
    if (sps.length === 0 || pos.length === 0) {
      return []
    }
    const fullStudyPrograms: FullStudyProgram[] = []
    for (const po of pos) {
      const studyProgram = sps.find(sp => sp.abbrev === po?.program)
      const grade = grades.find(g => g.abbrev === studyProgram?.grade)
      if (studyProgram && grade) {
        const poSpecializations = specializations.filter(s => s.po === po.abbrev)
        if (poSpecializations.length === 0) {
          fullStudyPrograms.push({studyProgram, grade, po})
        } else {
          poSpecializations.forEach(specialization => fullStudyPrograms.push({studyProgram, grade, po, specialization}))
        }
      }
    }
    return fullStudyPrograms.sort(fullStudyProgramOrd)
  }
)

export const selectSelectedStudyProgram = createSelector(
  selectFullStudyProgram,
  selectSelectedStudyProgramId,
  (studyPrograms, studyProgramId) => {
    if (!studyProgramId) {
      return undefined
    }
    const {poId, specializationId} = studyProgramId
    return studyPrograms.find(({po, specialization}) => {
      const selectedPo = po.abbrev === poId
      return specializationId
        ? selectedPo && specializationId === specialization?.abbrev
        : selectedPo
    })
  }
)
