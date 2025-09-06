import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'
import { ModuleTableEntry } from '../../components/module/module-list/module-table-entry'
import { Store } from '@ngrx/store'
import { ModuleFilterPageActions } from "../../state/actions/module-filter.actions"


@Component({
  selector: 'cops-module-cards',
  standalone: false,

  templateUrl: './module-cards.component.html',
  styleUrl: './module-cards.component.scss'
})
export class ModuleCardsComponent {
  constructor(private readonly store: Store) {}

  ngOnInit() {
    this.store.dispatch(ModuleFilterPageActions.enter())
  }

  onResetFilter = () => {
    this.store.dispatch(ModuleFilterPageActions.resetFilter())
  }

  protected dataSource = new MatTableDataSource<ModuleTableEntry>()

  @Input() set modules(xs: ModuleTableEntry[] | null) {
    if (xs) {
      this.dataSource.data = xs
    }
  }

  visibleModules = (): number => this.dataSource.data.length

  activeToggleMajors: number | null = null
  activeSearch = false
  activeFilter = false
  activeSort = false

  selectedIcon: string = ''

  toggleSearch(): void {
    this.selectedIcon = this.selectedIcon === "search" ? "" : "search";
    this.activeSearch = !this.activeSearch
    this.activeFilter = false
    this.activeSort = false
  }

  toggleFilter(): void {
    this.selectedIcon = this.selectedIcon === "filter" ? "" : "filter";
    this.activeFilter = !this.activeFilter
    this.activeSearch = false
    this.activeSort = false
  }

  toggleSort(): void {
    this.selectedIcon = this.selectedIcon === "sort" ? "" : "sort";
    this.activeSort = !this.activeSort
    this.activeSearch = false
    this.activeFilter = false
  }

  toggleMajors(index: number | null, event: MouseEvent) {
    event.stopPropagation()
    this.activeToggleMajors = this.activeToggleMajors === index ? null : index
  }

  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }

}
