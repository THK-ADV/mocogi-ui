import { Component } from '@angular/core';
import { showStudyProgramAtomic } from "../../ops/show.instances";
import { selectSelectedStudyProgram, selectStudyPrograms } from "../../state/selectors/module-filter.selectors";
import { StudyProgramAtomic } from "../../types/study-program-atomic";
import { ModuleFilterPageActions } from "../../state/actions/module-filter.actions";
import { Store } from "@ngrx/store";

@Component({
  selector: 'cops-module-compendiums-study-program-filter',
  templateUrl: './module-compendiums-study-program-filter.component.html',
  styleUrls: ['./module-compendiums-study-program-filter.component.css']
})
export class ModuleCompendiumsStudyProgramFilterComponent {
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
  protected readonly showStudyProgramAtomic = showStudyProgramAtomic;
}
