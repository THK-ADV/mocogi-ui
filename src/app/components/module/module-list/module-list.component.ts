import { Component, Input, ViewChild } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { createSelector, Store } from '@ngrx/store'
import { ModulePageActions } from '../../../state/actions/module.actions'
import { selectSelectedSort } from '../../../state/selectors/module.selectors'
import { MatSort, Sort } from '@angular/material/sort'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { selectSelectedStudyProgramId } from '../../../state/selectors/module-filter.selectors'
import { ModuleTableEntry } from './module-table-entry'

type DisplayedColumns = keyof (ModuleTableEntry & {
  expand: string
  actions: string
})

const selectDisplayedColumns = createSelector(
  selectSelectedStudyProgramId,
  (podId) => {
    const cols: DisplayedColumns[] = [
      'title',
      'moduleManagementStr',
      'ects',
      'recommendedSemesterStr',
    ]
    if (!podId) {
      cols.push('expand')
    }
    return cols
  },
)

@Component({
  selector: 'cops-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css'],
  animations: [
    // https://github.com/angular/components/issues/13431#issuecomment-574589827
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class ModuleListComponent {
  protected dataSource = new MatTableDataSource<ModuleTableEntry>()
  protected selectedSort$ = this.store.select(selectSelectedSort)
  protected displayedColumns$ = this.store.select(selectDisplayedColumns)
  protected expandedElement?: ModuleTableEntry

  @ViewChild(MatSort) sort!: MatSort

  @Input() set modules(xs: ModuleTableEntry[] | null) {
    if (xs) {
      this.dataSource.data = xs
      this.dataSource.sort = this.sort
    }
  }

  constructor(private readonly store: Store) {}

  updateSort = (sort: Sort) => {
    this.store.dispatch(ModulePageActions.selectSort({ sort }))
  }

  expandRow = (module: ModuleTableEntry, event: MouseEvent) => {
    this.expandedElement = this.expandedElement === module ? undefined : module
    event.stopPropagation()
  }

  selectRow = (module: ModuleTableEntry, event: MouseEvent) => {
    this.store.dispatch(ModulePageActions.selectModule({ moduleId: module.id }))
    event.stopPropagation()
  }

  visibleModules = (): number => this.dataSource.data.length
}
