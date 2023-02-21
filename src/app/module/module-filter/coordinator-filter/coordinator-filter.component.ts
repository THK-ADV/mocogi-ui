import { Component } from '@angular/core'
import { selectPeople, selectSelectedCoordinator } from '../../../state/selectors/module-filter.selectors'
import { ModuleFilterPageActions } from '../../../state/actions/module-filter.actions'
import { Store } from '@ngrx/store'
import { Person } from '../../../types/core/person'
import { Show } from '../../../ops/show'

@Component({
  selector: 'sched-coordinator-filter',
  templateUrl: './coordinator-filter.component.html',
  styleUrls: ['./coordinator-filter.component.css']
})
export class CoordinatorFilterComponent {
  attr = 'coordinator'

  label = 'Modulverantwortlicher'

  options$ = this.store.select(selectPeople)

  selection$ = this.store.select(selectSelectedCoordinator)

  show = Show.person

  selectAction = (person: Person) => ModuleFilterPageActions.selectCoordinator({coordinatorId: person.id})

  deselectAction = ModuleFilterPageActions.deselectCoordinator

  constructor(private readonly store: Store) {
  }
}
