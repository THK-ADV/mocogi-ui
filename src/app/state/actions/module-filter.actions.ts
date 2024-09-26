import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Identity } from '../../types/core/person'
import { SelectedStudyProgramId } from '../reducer/module-filter.reducer'
import { StudyProgram } from '../../types/module-compendium'

export const ModuleFilterPageActions = createActionGroup({
  source: 'Module Filter Page',
  events: {
    Enter: emptyProps(),
    'Select Study Program': props<{
      selectedStudyProgramId: SelectedStudyProgramId
    }>(),
    'Select Semester': props<{ semester: number }>(),
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
    'Retrieved Study Programs Success': props<{
      studyPrograms: readonly StudyProgram[]
    }>(),
    'Retrieved Identities Success': props<{ identities: Identity[] }>(),
  },
})
