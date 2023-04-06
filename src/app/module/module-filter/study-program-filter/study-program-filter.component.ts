import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { FullStudyProgram, selectFullStudyProgram, selectSelectedStudyProgram } from '../../../state/selectors/module-filter.selectors'
import { ModuleFilterPageActions } from '../../../state/actions/module-filter.actions'
import { showFullStudyProgram } from '../../../ops/show.instances'

@Component({
  selector: 'sched-study-program-filter',
  templateUrl: './study-program-filter.component.html',
  styleUrls: ['./study-program-filter.component.css']
})
export class StudyProgramFilterComponent {

  label = 'Studiengang'

  options$ = this.store.select(selectFullStudyProgram)

  selection$ = this.store.select(selectSelectedStudyProgram)

  show = showFullStudyProgram

  selectAction = ({po, specialization}: FullStudyProgram) => ModuleFilterPageActions.selectStudyprogram({
    selectedStudyProgramId: {poId: po.abbrev, specializationId: specialization?.abbrev}
  })

  deselectAction = ModuleFilterPageActions.deselectStudyprogram

  constructor(private readonly store: Store) {
  }
}
