import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Person } from '../../types/core/person'
import { SelectedStudyProgramId } from '../reducer/module-filter.reducer'

import { StudyProgramAtomic } from '../../types/study-program-atomic'

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
    'Retrieved StudyPrograms Success': props<{ studyPrograms: StudyProgramAtomic[] }>(),
    'Retrieved People Success': props<{ people: Person[] }>(),
  },
})
