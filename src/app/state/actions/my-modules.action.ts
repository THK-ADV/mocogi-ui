import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModeratedModule } from '../../types/moderated.module'

export const MyModulesPageActions = createActionGroup({
  source: 'My Modules Page',
  events: {
    Enter: emptyProps(),
    'Create Module': emptyProps(),
    'Show Latest Module': props<{ moduleId: string }>(),
    'Edit Module': props<{ moduleId: string }>(),
    'Discard Changes': props<{ moduleId: string }>(),
    'Request Review': props<{ moduleId: string }>(),
    'Cancel Review': props<{ moduleId: string }>(),
    'Publish Module': props<{ moduleId: string }>(),
    'Stop Publication': props<{ moduleId: string }>(),
  },
})

export const MyModulesApiActions = createActionGroup({
  source: 'My Modules API',
  events: {
    'Retrieved Moderated Modules Success': props<{
      moderatedModules: ModeratedModule[]
    }>(),
    'Requested Review Successfully': emptyProps(),
    'Discarded Changes Successfully': emptyProps(),
    'Retrieved Error': props<{ error: Error }>(),
  },
})
