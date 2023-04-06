import { Component } from '@angular/core'
import { selectSelectedSemester, selectSemester } from '../../../state/selectors/module-filter.selectors'
import { ModuleFilterPageActions } from '../../../state/actions/module-filter.actions'
import { Store } from '@ngrx/store'

@Component({
  selector: 'sched-semester-filter',
  templateUrl: './semester-filter.component.html',
  styleUrls: ['./semester-filter.component.css']
})
export class SemesterFilterComponent {
  attr = 'semester'

  label = 'Semester'

  options$ = this.store.select(selectSemester)

  selection$ = this.store.select(selectSelectedSemester)

  show = (semester: number) => String(semester)

  selectAction = (semester: number) => ModuleFilterPageActions.selectSemester({semester})

  deselectAction = ModuleFilterPageActions.deselectSemester

  constructor(private readonly store: Store) {
  }
}
