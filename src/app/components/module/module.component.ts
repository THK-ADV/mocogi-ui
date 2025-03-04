import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import {
  selectLatestModuleUpdate,
  selectModules,
} from '../../state/selectors/module.selectors'
import { ModulePageActions } from '../../state/actions/module.actions'
import { ModuleTableEntry } from './module-list/module-table-entry'

@Component({
  selector: 'cops-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
  standalone: false,
})
export class ModuleComponent implements OnInit {
  modules$: Observable<ModuleTableEntry[]>
  latestModuleUpdate$: Observable<Date | null>

  constructor(private readonly store: Store) {
    this.modules$ = store.select(selectModules)
    this.latestModuleUpdate$ = store.select(selectLatestModuleUpdate)
  }

  ngOnInit(): void {
    this.store.dispatch(ModulePageActions.enter())
  }
}
