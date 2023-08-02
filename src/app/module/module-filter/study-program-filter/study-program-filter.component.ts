import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { ModuleFilterPageActions } from '../../../state/actions/module-filter.actions'
import { selectSelectedStudyProgram, selectStudyPrograms } from '../../../state/selectors/module-filter.selectors'
import { showStudyProgramAtomic } from '../../../ops/show.instances'
import { StudyProgramAtomic } from '../../../types/study-program-atomic'

@Component({
  selector: 'cops-study-program-filter',
  templateUrl: './study-program-filter.component.html',
  styleUrls: ['./study-program-filter.component.css'],
})
export class StudyProgramFilterComponent {

  label = 'Studiengang'

  options$ = this.store.select(selectStudyPrograms)

  selection$ = this.store.select(selectSelectedStudyProgram)

  show = showStudyProgramAtomic

  selectAction = ({poAbbrev, specialization}: StudyProgramAtomic) => ModuleFilterPageActions.selectStudyProgram({
    selectedStudyProgramId: {poId: poAbbrev, specializationId: specialization?.abbrev},
  })

  deselectAction = ModuleFilterPageActions.deselectStudyProgram

  constructor(private readonly store: Store) {
  }
}
