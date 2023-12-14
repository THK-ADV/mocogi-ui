import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { ModuleCompendiumsFilterActions } from "../../state/actions/module-compendium-filter.actions";

@Component({
  selector: 'cops-module-compendiums-filter',
  templateUrl: './module-compendiums-filter.component.html',
  styleUrls: ['./module-compendiums-filter.component.css']
})
export class ModuleCompendiumsFilterComponent {
  constructor(private readonly store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(ModuleCompendiumsFilterActions.enter())
  }

  onResetFilter = () => {
    this.store.dispatch(ModuleCompendiumsFilterActions.resetFilter())
  }
}