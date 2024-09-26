import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ElectivesCatalogue } from '../../types/electivesCatalogues'

export const ElectivesCatalogsPageActions = createActionGroup({
  source: 'Electives Catalogues Page',
  events: {
    Enter: emptyProps(),
    'Filter Electives Catalogs': props<{ filter: string }>(),
    'Reset Filter': emptyProps(),
  },
})

export const ElectivesCatalogsApiActions = createActionGroup({
  source: 'Electives Catalogues API',
  events: {
    'Retrieved Electives Catalogs Success': props<{
      electivesCatalogues: ReadonlyArray<ElectivesCatalogue>
    }>(),
    'Retrieved Electives Catalogs Failure': props<{ error: string }>(),
  },
})
