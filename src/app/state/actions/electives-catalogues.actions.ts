import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ElectivesCatalogue } from "../../types/electivesCatalogues";

export const ElectivesCataloguesPageActions = createActionGroup({
  source: 'Electives Catalogues Page',
  events: {
    'Enter': emptyProps(),
    'Filter Electives Catalogues': props<{ filter: string }>(),
    'Reset Filter': emptyProps(),
  },
})

export const ElectivesCataloguesApiActions = createActionGroup({
  source: 'Electives Catalogues API',
  events: {
    'Retrieved Electives Catalogues Success': props<{ electivesCatalogues: ReadonlyArray<ElectivesCatalogue> }>(),
    'Retrieved Electives Catalogues Failure': props<{ error: string }>(),
  },
})
