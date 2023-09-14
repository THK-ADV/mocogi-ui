import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Module } from 'src/app/types/module'
import { ModuleDraft } from 'src/app/types/module-draft'

export const MyModulesPageActions = createActionGroup({
  source: 'My Modules Page',
  events: {
    'Enter': emptyProps(),
    'Create Module':emptyProps(),
    'Show Module': props<{ moduleId: string }>(),
    'Edit Module': props<{ moduleId: string }>(),
    'Discard Changes': props<{ moduleId: string }>(),
    'Request Review': props<{ moduleId: string }>(),
    'Publish Module': props<{ moduleId: string }>(),
    'Stop Publication': props<{ moduleId: string }>(),
  },
})

export const MyModulesApiActions = createActionGroup({
  source: 'My Modules API',
  events: {
    'Retrieved Modules Success': props<{ modules: Module[] }>(),
    'Retrieved Module Drafts Success': props<{ moduleDrafts: ModuleDraft[] }>(),
    'Retrieved Error': props<{ error: Error }>(),
  },
})
