import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { ModuleCompendiumsFilterComponentActions } from '../../state/actions/module-compendiums-filter.actions'
import { HttpService } from '../../http/http.service'
import {
  selectSelectedSemester,
  selectSelectedStudyProgram
} from "../../state/selectors/module-compendiums-filter.selectors";
import { Semester } from "../../types/module-compendium-list";
import { StudyProgram } from "../../types/core/study-program";

@Component({
  selector: 'cops-module-compendiums-filter',
  templateUrl: './module-compendiums-filter.component.html',
  styleUrls: ['./module-compendiums-filter.component.css'],
})
export class ModuleCompendiumsFilterComponent implements OnInit {
  constructor(private readonly store: Store, private readonly httpService: HttpService) {
  }

  ngOnInit() {
    this.store.dispatch(ModuleCompendiumsFilterComponentActions.enter())
  }

  onResetFilter = () => {
    this.store.dispatch(ModuleCompendiumsFilterComponentActions.resetFilter())
  }

  semesters = this.httpService.getSemesters()

  selectedSemester$ = this.store.select(selectSelectedSemester)

  selectSemester = (semester: Semester) => ModuleCompendiumsFilterComponentActions.selectSemester({ semester })

  deselectSemester = ( ) => ModuleCompendiumsFilterComponentActions.deselectSemester

  showSemester = (semester: Semester) => semester.deLabel

  studyPrograms = this.httpService.allStudyPrograms()

  selectedStudyProgram$ = this.store.select(selectSelectedStudyProgram)

  selectStudyProgram = (selectedStudyProgram: StudyProgram) => ModuleCompendiumsFilterComponentActions.selectStudyProgram({ selectedStudyProgramId: selectedStudyProgram.abbrev })

  deselectStudyProgram = () => ModuleCompendiumsFilterComponentActions.deselectStudyProgram

  showStudyProgram = (sp: StudyProgram) => `${sp.deLabel} (${sp.grade})`

  updateFilter = () => {
    return
  }
}
