import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ModuleCatalog } from '../../types/module-compendium'

export const ModuleCatalogsPageActions = createActionGroup({
  source: 'Module Catalogs Page',
  events: {
    Enter: emptyProps(),
    'Filter Module Catalogs': props<{ filter: string }>(),
    'Reset Filter': emptyProps(),
  },
})

export const ModuleCatalogsApiActions = createActionGroup({
  source: 'Module Catalogs API',
  events: {
    'Retrieved Modules Catalogs Success': props<{
      moduleCatalogs: ReadonlyArray<ModuleCatalog>
    }>(),
    'Retrieved Modules Catalogs Failure': props<{ error: string }>(),
  },
})
