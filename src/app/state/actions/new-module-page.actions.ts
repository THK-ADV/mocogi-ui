import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleProtocol } from '../../types/moduleCore'

export const NewModulePageActions = createActionGroup({
  source: 'New Module Page',
  events: {
    'Enter': emptyProps(),
    'Save': props<{ moduleCompendiumProtocol: ModuleProtocol }>(),
    'Cancel': emptyProps(),
  },
})

export const NewModuleApiActions = createActionGroup({
  source: 'New Module API',
  events: {
    'Saved Changes Success': emptyProps(),
    'Saved Changes Failure': props<{ error: Error }>(),
  },
})
