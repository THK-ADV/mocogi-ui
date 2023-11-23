import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { ModuleCompendiumsFilterComponentActions } from '../../state/actions/module-compendiums-filter.actions'
import { HttpService } from '../../http/http.service'

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

  selectAction = () => ({type: 'XYZ'})
  deselectAction = () => ({type: 'XYZ'})

  semesters = () => {
    return this.httpService.getSemesters()
  }

  updateFilter = () => {
    return
  }

  showSemester = (semester: string) => semester
}
