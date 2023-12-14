import { Component } from '@angular/core';
import { selectModuleFilter } from "../../state/selectors/module.selectors";
import { Store } from "@ngrx/store";
import { ModulePageActions } from "../../state/actions/module.actions";

@Component({
  selector: 'cops-module-compendiums-search-filter',
  templateUrl: './module-compendiums-search-filter.component.html',
  styleUrls: ['./module-compendiums-search-filter.component.css']
})
export class ModuleCompendiumsSearchFilterComponent {
  filterValue$ = this.store.select(selectModuleFilter)

  constructor(private readonly store: Store) {

  }

  updateFilter = (filter?: string) => {
    if (filter) {
      this.store.dispatch(ModulePageActions.filterModule({filter}))
    } else {
      this.resetFilter()
    }
  }

  resetFilter = ($event?: MouseEvent) => {
    this.store.dispatch(ModulePageActions.resetFilter())
    $event?.stopPropagation()
  }
}
