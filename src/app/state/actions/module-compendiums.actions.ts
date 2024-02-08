import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleCompendium } from "../../types/module-compendium";

export const ModuleCompendiumsPageActions = createActionGroup({
  source: 'Module Compendiums Page',
  events: {
    'Enter': emptyProps(),
    'Filter Module Compendiums': props<{ filter: string }>(),
    'Reset Filter': emptyProps(),
  },
})

export const ModuleCompendiumsApiActions = createActionGroup({
  source: 'Module Compendiums API',
  events: {
    'Retrieved Modules Compendiums Success': props<{ moduleCompendiums: ReadonlyArray<ModuleCompendium> }>(),
    'Retrieved Modules Compendiums Failure': props<{ error: string }>(),
  },
})
