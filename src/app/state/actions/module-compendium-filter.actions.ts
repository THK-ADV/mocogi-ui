import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Person } from '../../types/core/person'
import { SelectedStudyProgramId } from '../reducer/module-filter.reducer'

import { StudyProgramAtomic } from '../../types/study-program-atomic'
import { SemesterAtomic } from "../../types/core/semester";

export const ModuleCompendiumsFilterActions = createActionGroup({
  source: 'Module Filter Page',
  events: {
    'Enter': emptyProps(),
    'Select Study Program': props<{ selectedStudyProgramId: SelectedStudyProgramId }>(),
    'Select Semester': props<{ semester: SemesterAtomic }>(),
    'Select Coordinator': props<{ coordinatorId: string }>(),
    'Deselect Study Program': emptyProps(),
    'Deselect Semester': emptyProps(),
    'Deselect Coordinator': emptyProps(),
    'Reset Filter': emptyProps(),
  },
})

export const ModuleFilterAPIActions = createActionGroup({
  source: 'Module Filter API',
  events: {
    'Retrieved Study Programs Success': props<{ studyPrograms: StudyProgramAtomic[] }>(),
    'Retrieved People Success': props<{ people: Person[] }>(),
  },
})
