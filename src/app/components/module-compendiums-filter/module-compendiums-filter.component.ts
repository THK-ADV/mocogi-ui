import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { ModuleCompendiumsFilterComponentActions } from '../../state/actions/module-compendiums-filter.actions'
import {
  selectSelectedSemester,
  selectSelectedStudyProgram,
  selectSemesters,
  selectStudyPrograms,
} from '../../state/selectors/module-compendiums-filter.selectors'
import { Semester, StudyProgramCore } from '../../types/module-compendium'

@Component({
  selector: 'cops-module-compendiums-filter',
  templateUrl: './module-compendiums-filter.component.html',
  styleUrls: ['./module-compendiums-filter.component.css'],
})
export class ModuleCompendiumsFilterComponent implements OnInit {
  constructor(private readonly store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(ModuleCompendiumsFilterComponentActions.enter())
  }

  onResetFilter = () => {
    this.store.dispatch(ModuleCompendiumsFilterComponentActions.resetFilter())
  }

  semesters = this.store.select(selectSemesters)

  selectedSemester$ = this.store.select(selectSelectedSemester)

  selectSemester = (semester: Semester) => ModuleCompendiumsFilterComponentActions.selectSemester({semester})

  deselectSemester = () => ModuleCompendiumsFilterComponentActions.deselectSemester()

  showSemester = (semester: Semester) => semester.deLabel

  studyPrograms = this.store.select(selectStudyPrograms)

  selectedStudyProgram$ = this.store.select(selectSelectedStudyProgram)

  selectStudyProgram = (selectedStudyProgram: StudyProgramCore) => ModuleCompendiumsFilterComponentActions.selectStudyProgram({selectedStudyProgramId: selectedStudyProgram.id})

  deselectStudyProgram = () => ModuleCompendiumsFilterComponentActions.deselectStudyProgram()

  showStudyProgram = (sp: StudyProgramCore) => `${sp.deLabel} (${sp.degree.deLabel})`

  updateFilter = () => {
    return
  }
}
