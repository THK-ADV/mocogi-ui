import { Component } from '@angular/core'
import { PO } from '../../../types/core/po'
import { StudyProgram } from '../../../types/core/study-program'
import { Grade } from '../../../types/core/grade'
import { Store } from '@ngrx/store'
import { selectSelectedStudyProgramWithPO, selectStudyProgramWithPO } from '../../../state/selectors/module-filter.selectors'
import { ModuleFilterPageActions } from '../../../state/actions/module-filter.actions'
import { showStudyProgramWithPo } from '../../../ops/show.instances'

@Component({
  selector: 'sched-study-program-filter',
  templateUrl: './study-program-filter.component.html',
  styleUrls: ['./study-program-filter.component.css']
})
export class StudyProgramFilterComponent {

  label = 'Studiengang'

  options$ = this.store.select(selectStudyProgramWithPO)

  selection$ = this.store.select(selectSelectedStudyProgramWithPO)

  show = showStudyProgramWithPo

  selectAction = ([po,]: [PO, StudyProgram, Grade]) => ModuleFilterPageActions.selectPo({poId: po.abbrev})

  deselectAction = ModuleFilterPageActions.deselectPo

  constructor(private readonly store: Store) {
  }
}
