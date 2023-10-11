import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleCompendiumProtocol } from '../../types/module-compendium'

export const NewModulePageActions = createActionGroup({
  source: 'New Module Page',
  events: {
    'Enter': emptyProps(),
    'Save': props<{ moduleCompendiumProtocol: ModuleCompendiumProtocol }>(),
    'Cancel': emptyProps(),
  },
})

export const UpdateModuleApiActions = createActionGroup({
  source: 'New Module API',
  events: {
    'Saved Changes Success': emptyProps(),
    'Saved Changes Failure': props<{ error: Error }>(),
  },
})
