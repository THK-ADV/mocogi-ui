import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Person } from '../../types/core/person'
import { SelectedStudyProgramId } from '../reducer/module-filter.reducer'

import { StudyProgramAtomic } from '../../types/study-program-atomic'

export const ModuleCompendiumsFilterComponentActions = createActionGroup({
  source: 'Module Compendiums Filter Component',
  events: {
    'Enter': emptyProps(),
    'Select Study Program': props<{ selectedStudyProgramId: SelectedStudyProgramId }>(),
    'Select Semester': props<{ semester: number }>(),
    'Select Coordinator': props<{ coordinatorId: string }>(),
    'Deselect Study Program': emptyProps(),
    'Deselect Semester': emptyProps(),
    'Deselect Coordinator': emptyProps(),
    'Reset Filter': emptyProps(),
  },
})

export const ModuleCompendiumsFilterAPIActions = createActionGroup({
  source: 'Module Compendiums Filter API',
  events: {
    'Retrieved Study Programs Success': props<{ studyPrograms: StudyProgramAtomic[] }>(),
    'Retrieved People Success': props<{ people: Person[] }>(),
  },
})
