import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Semester, StudyProgramCore } from '../../types/module-compendium'

export const ModuleCompendiumsFilterComponentActions = createActionGroup({
  source: 'Module Compendiums Filter Component',
  events: {
    'Enter': emptyProps(),
    'UpdateSearchQuery': props<{ searchQuery: string }>(),
    'Select Study Program': props<{ selectedStudyProgramId: string }>(),
    'Deselect Study Program': emptyProps(),
    'Select Semester': props<{ semester: Semester }>(),
    'Deselect Semester': emptyProps(),
    'Reset Filter': emptyProps(),
  },
})

export const ModuleCompendiumsFilterAPIActions = createActionGroup({
  source: 'Module Compendiums Filter API',
  events: {
    'Retrieved Study Programs Success': props<{ studyPrograms: readonly StudyProgramCore[] }>(),
    'Retrieved Semesters Success': props<{ semesters: readonly Semester[] }>(),
  },
})
