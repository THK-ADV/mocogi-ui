import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { StudyProgram } from '../../types/core/study-program'
import { PO } from '../../types/core/po'
import { Grade } from '../../types/core/grade'
import { Person } from '../../types/core/person'

export const ModuleFilterPageActions = createActionGroup({
  source: 'Module Filter Page',
  events: {
    'Enter': emptyProps(),
    'Select PO': props<{ poId: string }>(),
    'Select Semester': props<{ semester: number }>(),
    'Select Coordinator': props<{ coordinatorId: string }>(),
    'Deselect PO': emptyProps(),
    'Deselect Semester': emptyProps(),
    'Deselect Coordinator': emptyProps(),
    'Reset Filter': emptyProps(),
  }
})

export const ModuleFilterAPIActions = createActionGroup({
  source: 'Module Filter API',
  events: {
    'Retrieved StudyPrograms Success': props<{ studyPrograms: StudyProgram[] }>(),
    'Retrieved POs Success': props<{ pos: PO[] }>(),
    'Retrieved Grades Success': props<{ grades: Grade[] }>(),
    'Retrieved People Success': props<{ people: Person[] }>(),
  }
})
