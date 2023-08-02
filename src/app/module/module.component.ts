import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectModules } from '../state/selectors/module.selectors'
import { ModulePageActions } from '../state/actions/module.actions'
import { ModuleTableEntry } from './module-list/module-table-entry'

@Component({
  selector: 'cops-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
})
export class ModuleComponent implements OnInit {

  modules$: Observable<ModuleTableEntry[]>

  constructor(private readonly store: Store) {
    this.modules$ = store.select(selectModules)
  }

  ngOnInit(): void {
    this.store.dispatch(ModulePageActions.enter())
  }
}
