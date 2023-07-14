import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectModuleTableRepresentation } from '../state/selectors/module.selectors'
import { ModulePageActions } from '../state/actions/module.actions'
import { ModuleTableRepresentation } from './module-list/module-table-representation'

@Component({
  selector: 'sched-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
})
export class ModuleComponent implements OnInit {

  modules$: Observable<ReadonlyArray<ModuleTableRepresentation>>

  constructor(private readonly store: Store) {
    this.modules$ = store.select(selectModuleTableRepresentation)
  }

  ngOnInit(): void {
    this.store.dispatch(ModulePageActions.enter())
  }
}
