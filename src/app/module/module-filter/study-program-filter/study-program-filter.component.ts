import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { ModuleFilterPageActions } from '../../../state/actions/module-filter.actions'
import {
  selectSelectedStudyProgram,
  selectStudyPrograms,
} from '../../../state/selectors/module-filter.selectors'
import { showStudyProgram } from '../../../ops/show.instances'
import { StudyProgram } from '../../../types/module-compendium'

@Component({
  selector: 'cops-study-program-filter',
  templateUrl: './study-program-filter.component.html',
  styleUrls: ['./study-program-filter.component.css'],
})
export class StudyProgramFilterComponent {
  label = $localize`Studiengang`

  options$ = this.store.select(selectStudyPrograms)

  selection$ = this.store.select(selectSelectedStudyProgram)

  show = showStudyProgram

  selectAction = ({ po, specialization }: StudyProgram) =>
    ModuleFilterPageActions.selectStudyProgram({
      selectedStudyProgramId: {
        poId: po.id,
        specializationId: specialization?.id,
      },
    })

  deselectAction = ModuleFilterPageActions.deselectStudyProgram

  constructor(private readonly store: Store) {}
}
