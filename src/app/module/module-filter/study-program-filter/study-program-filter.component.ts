import { Component } from '@angular/core'
import { PO } from '../../../types/core/po'
import { StudyProgram } from '../../../types/core/study-program'
import { Grade } from '../../../types/core/grade'
import { Store } from '@ngrx/store'
import { selectSelectedStudyProgramWithPO, selectStudyProgramWithPO } from '../../../state/selectors/module-filter.selectors'
import { ModuleFilterPageActions } from '../../../state/actions/module-filter.actions'

@Component({
  selector: 'sched-study-program-filter',
  templateUrl: './study-program-filter.component.html',
  styleUrls: ['./study-program-filter.component.css']
})
export class StudyProgramFilterComponent {

  label = 'Studiengang'

  options$ = this.store.select(selectStudyProgramWithPO)

  selection$ = this.store.select(selectSelectedStudyProgramWithPO)

  show = (a: [PO, StudyProgram, Grade]) => {
    const [po, sp, g] = a
    // TODO temporary fix for handling 'flex issue'. see: https://git.st.archi-lab.io/adobryni/modulhandbuecher_test/-/issues/3
    return po.abbrev.endsWith('flex')
      ? `${sp.deLabel}-Flex (${g.deLabel} - PO ${po.version})`
      : `${sp.deLabel} (${g.deLabel} - PO ${po.version})`
  }

  selectAction = ([po,]: [PO, StudyProgram, Grade]) => ModuleFilterPageActions.selectPo({poId: po.abbrev})

  deselectAction = ModuleFilterPageActions.deselectPo

  constructor(private readonly store: Store) {
  }
}
