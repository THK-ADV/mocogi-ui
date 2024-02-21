import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { selectSelectedSemester, selectSemesters } from '../../state/selectors/electives-catalogs-filter.selector'
import { Semester } from '../../types/module-compendium'
import { ElectivesCatalogsFilterComponentActions } from '../../state/actions/electives-catalogs-filter.actions'
@Component({
  selector: 'cops-electives-catalogs-filter',
  templateUrl: './electives-catalogs-filter.component.html',
  styleUrls: ['./electives-catalogs-filter.component.css'],
})
export class ElectivesCatalogsFilterComponent implements OnInit {
  constructor(private readonly store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(ElectivesCatalogsFilterComponentActions.enter())
  }

  onResetFilter = () => {
    this.store.dispatch(ElectivesCatalogsFilterComponentActions.resetFilter())
  }

  semesters = this.store.select(selectSemesters)

  selectedSemester$ = this.store.select(selectSelectedSemester)

  selectSemester = (semester: Semester) => ElectivesCatalogsFilterComponentActions.selectSemester({ semester })

  deselectSemester = ( ) => ElectivesCatalogsFilterComponentActions.deselectSemester()

  showSemester = (semester: Semester) => semester.deLabel

  updateFilter = () => {
    return
  }
}