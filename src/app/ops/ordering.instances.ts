import { Ordering } from './ordering'
import { PO } from '../types/core/po'
import { StudyProgram } from '../types/core/study-program'
import { Grade } from '../types/core/grade'
import { StudyProgramWithPO } from '../state/selectors/module-filter.selectors'

export const numberOrd: Ordering<number> = (lhs, rhs) =>
  lhs < rhs ? -1 : (lhs > rhs ? 1 : 0)

export const stringOrd: Ordering<string> = (lhs, rhs) => {
  const res = lhs.localeCompare(rhs)
  return res === 0 ? 0 : (res > 0 ? 1 : -1)
}

export const poOrd: Ordering<PO> = Ordering.contraMap(numberOrd, po => po.version)

export const studyProgramOrd: Ordering<StudyProgram> = Ordering.contraMap(stringOrd, sp => sp.deLabel)

export const gradeOrd: Ordering<Grade> = Ordering.contraMap(stringOrd, g => g.abbrev)

export const studyProgramWithPOOrd = Ordering.many<StudyProgramWithPO>([
  Ordering.contraMap(studyProgramOrd, ([, sp,]) => sp),
  Ordering.contraMap(poOrd, ([po, ,]) => po),
  Ordering.contraMap(gradeOrd, ([, , g]) => g)
])
