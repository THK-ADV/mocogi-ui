import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleProtocol } from '../../types/moduleCore'

export const UpdateModulePageActions = createActionGroup({
  source: 'Update Module Page',
  events: {
    Enter: emptyProps(),
    Save: props<{
      moduleId: string
      moduleCompendiumProtocol: ModuleProtocol
    }>(),
    Cancel: emptyProps(),
  },
})

export const UpdateModuleApiActions = createActionGroup({
  source: 'Update Module API',
  events: {
    'Saved Changes Success': emptyProps(),
    'Saved Changes Failure': emptyProps(),
  },
})
