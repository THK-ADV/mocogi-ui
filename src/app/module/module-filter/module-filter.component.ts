import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { ModuleFilterPageActions } from '../../state/actions/module-filter.actions'

@Component({
  selector: 'sched-module-filter',
  templateUrl: './module-filter.component.html',
  styleUrls: ['./module-filter.component.css']
})
export class ModuleFilterComponent implements OnInit {

  constructor(private readonly store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(ModuleFilterPageActions.enter())
  }

  onResetFilter = () => {
    this.store.dispatch(ModuleFilterPageActions.resetFilter())
  }
}
