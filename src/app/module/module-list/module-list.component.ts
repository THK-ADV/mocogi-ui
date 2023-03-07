import { Component, Input, ViewChild } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { createSelector, Store } from '@ngrx/store'
import { ModulePageActions } from '../../state/actions/module.actions'
import { selectSelectedSort } from '../../state/selectors/module.selectors'
import { MatSort, Sort } from '@angular/material/sort'
import { ModuleTableRepresentation } from './module-table-representation'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { selectSelectedPOId } from '../../state/selectors/module-filter.selectors'

type DisplayedColumns = keyof Omit<ModuleTableRepresentation, 'id'>

const displayedColumns: DisplayedColumns[] = ['title', 'abbrev', 'coordinator', 'ects', 'semester']

const selectDisplayedColumns = createSelector(
  selectSelectedPOId,
  (podId) => podId ? displayedColumns : [...displayedColumns, 'expand']
)

@Component({
  selector: 'sched-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css'],
  animations: [ // https://github.com/angular/components/issues/13431#issuecomment-574589827
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class ModuleListComponent {

  protected dataSource = new MatTableDataSource<ModuleTableRepresentation>()
  protected selectedSort$ = this.store.select(selectSelectedSort)
  protected displayedColumns$ = this.store.select(selectDisplayedColumns)
  protected expandedElement?: ModuleTableRepresentation

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

  expandRow = (element: ModuleTableRepresentation, event: MouseEvent) => {
    this.expandedElement = this.expandedElement === element ? undefined : element
    event.stopPropagation()
  }

  selectRow = (element: ModuleTableRepresentation, event: MouseEvent) => {
    this.store.dispatch(ModulePageActions.selectModule({moduleId: element.id}))
    event.stopPropagation()
  }
}
