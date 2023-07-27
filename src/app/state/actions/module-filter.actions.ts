import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { StudyProgram } from '../../types/core/study-program'
import { PO } from '../../types/core/po'
import { Grade } from '../../types/core/grade'
import { Person } from '../../types/core/person'
import { Specialization } from '../../types/specialization'
import { SelectedStudyProgramId } from '../reducer/module-filter.reducer'

export const ModuleFilterPageActions = createActionGroup({
  source: 'Module Filter Page',
  events: {
    'Enter': emptyProps(),
    'Select StudyProgram': props<{ selectedStudyProgramId: SelectedStudyProgramId }>(),
    'Select Semester': props<{ semester: number }>(),
    'Select Coordinator': props<{ coordinatorId: string }>(),
    'Deselect StudyProgram': emptyProps(),
    'Deselect Semester': emptyProps(),
    'Deselect Coordinator': emptyProps(),
    'Reset Filter': emptyProps(),
  },
})

export const ModuleFilterAPIActions = createActionGroup({
  source: 'Module Filter API',
  events: {
    'Retrieved StudyPrograms Success': props<{ studyPrograms: StudyProgram[] }>(),
    'Retrieved POs Success': props<{ pos: PO[] }>(),
    'Retrieved Grades Success': props<{ grades: Grade[] }>(),
    'Retrieved People Success': props<{ people: Person[] }>(),
    'Retrieved Specializations Success': props<{ specializations: Specialization[] }>(),
  },
})
