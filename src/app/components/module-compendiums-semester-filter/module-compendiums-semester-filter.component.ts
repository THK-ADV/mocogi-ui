import { Component } from '@angular/core';
import { showStudyProgramAtomic } from "../../ops/show.instances";
import {
  selectSelectedSemester,
  selectSemester,
} from "../../state/selectors/module-filter.selectors";
import { SemesterAtomic } from "../../types/core/semester"
import { Store } from "@ngrx/store";
import { ModuleCompendiumsFilterActions } from "../../state/actions/module-compendium-filter.actions";

@Component({
  selector: 'cops-module-compendiums-semester-filter',
  templateUrl: './module-compendiums-semester-filter.component.html',
  styleUrls: ['./module-compendiums-semester-filter.component.css']
})
export class ModuleCompendiumsSemesterFilterComponent {
  label = 'Semester'

  options$ = this.store.select(selectSemester)

  selection$ = this.store.select(selectSelectedSemester)

  show = showStudyProgramAtomic

  selectAction = (semester: SemesterAtomic) => ModuleCompendiumsFilterActions.selectSemester({semester: semester})

  deselectAction = ModuleCompendiumsFilterActions.deselectSemester

  constructor(private readonly store: Store) {
  }
  protected readonly showStudyProgramAtomic = showStudyProgramAtomic;
}
