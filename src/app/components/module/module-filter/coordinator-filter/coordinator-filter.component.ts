import { Component } from '@angular/core'
import {
  selectIdentities,
  selectSelectedCoordinator,
} from '../../../../state/selectors/module-filter.selectors'
import { ModuleFilterPageActions } from '../../../../state/actions/module-filter.actions'
import { Store } from '@ngrx/store'
import { Identity } from '../../../../types/core/person'
import { showPerson } from '../../../../ops/show.instances'

@Component({
  selector: 'cops-coordinator-filter',
  templateUrl: './coordinator-filter.component.html',
  styleUrls: ['./coordinator-filter.component.css'],
  standalone: false,
})
export class CoordinatorFilterComponent {
  attr = 'coordinator'

  label = $localize`Modulverantwortliche*r`

  options$ = this.store.select(selectIdentities)

  selection$ = this.store.select(selectSelectedCoordinator)

  show = showPerson

  id = (a: Identity) => a.id

  selectAction = (person: Identity) =>
    ModuleFilterPageActions.selectCoordinator({ coordinatorId: person.id })

  deselectAction = ModuleFilterPageActions.deselectCoordinator

  constructor(private readonly store: Store) {}
}
