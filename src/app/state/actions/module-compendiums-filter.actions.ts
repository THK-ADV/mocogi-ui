import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Person } from '../../types/core/person'
import { SelectedStudyProgramId } from '../reducer/module-filter.reducer'

import { StudyProgramAtomic } from '../../types/study-program-atomic'
import { Semester } from "../../types/module-compendium-list";
import { StudyProgram } from "../../types/core/study-program";

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
    'Retrieved Study Programs Success': props<{ studyPrograms: readonly StudyProgram[] }>(),
    'Retrieved Semesters Success': props<{ semesters: readonly Semester[] }>(),
  },
})
