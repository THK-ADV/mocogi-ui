import { Component, Input, ViewChild } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { Metadata } from '../../types/metadata'
import { Store } from '@ngrx/store'
import { ModulePageActions } from '../../state/actions/module.actions'
import { selectSelectedSort } from '../../state/selectors/module.selectors'
import { MatSort, Sort } from '@angular/material/sort'
import { ModuleTableRepresentation } from './module-table-representation'

type DisplayedColumns = keyof Omit<ModuleTableRepresentation, 'id'>

@Component({
  selector: 'sched-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent {

  dataSource = new MatTableDataSource<ModuleTableRepresentation>()
  selectedSort$ = this.store.select(selectSelectedSort)

  displayedColumns: DisplayedColumns[] = ['title', 'abbrev', 'coordinator', 'ects', 'semester']

  @ViewChild(MatSort) sort!: MatSort

  @Input() set modules(xs: ReadonlyArray<ModuleTableRepresentation> | null) {
    if (xs) {
      this.dataSource.data = [...xs]
      this.dataSource.sort = this.sort
    }
  }

  constructor(private readonly store: Store) {

  }

  updateSort = (sort: Sort) => {
    this.store.dispatch(ModulePageActions.selectSort({sort}))
  }

  selectRow = (module: Metadata) => {
    this.store.dispatch(ModulePageActions.selectModule({moduleId: module.id}))
  }
}
