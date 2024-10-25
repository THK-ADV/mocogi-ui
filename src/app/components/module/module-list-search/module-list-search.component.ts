import { Component } from '@angular/core'
import { selectModuleFilter } from '../../../state/selectors/module.selectors'
import { Store } from '@ngrx/store'
import { ModulePageActions } from '../../../state/actions/module.actions'

@Component({
  selector: 'cops-module-list-search',
  templateUrl: './module-list-search.component.html',
  styleUrls: ['./module-list-search.component.css'],
})
export class ModuleListSearchComponent {
  filterValue$ = this.store.select(selectModuleFilter)

  constructor(private readonly store: Store) {}

  updateFilter = (filter?: string) => {
    if (filter) {
      this.store.dispatch(ModulePageActions.filterModule({ filter }))
    } else {
      this.resetFilter()
    }
  }

  resetFilter = ($event?: MouseEvent) => {
    this.store.dispatch(ModulePageActions.resetFilter())
    $event?.stopPropagation()
  }
}
