import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleCompendiumProtocol } from '../../types/module-compendium'

export const UpdateModulePageActions = createActionGroup({
    source: 'Update Module Page',
    events: {
        'Enter': emptyProps(),
        'Save': props<{ moduleId: string, moduleCompendiumProtocol: ModuleCompendiumProtocol }>(),
        'Cancel': emptyProps(),
    },
})

export const UpdateModuleApiActions = createActionGroup({
    source: 'Update Module API',
    events: {
        'Saved Changes Success': emptyProps(),
        'Saved Changes Failure': props<{ error: Error }>(),
    },
})
