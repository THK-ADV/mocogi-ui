import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { MyModulesPageActions } from 'src/app/state/actions/my-modules.action'
import { selectModeratedModules } from 'src/app/state/selectors/my-modules.selectors'
import { map, Observable } from 'rxjs'
import { ModeratedModule } from '../../types/moderated.module'
import { NavigationActions } from '../../state/actions/navigation.actions'

@Component({
  selector: 'cops-my-modules-page',
  templateUrl: './my-modules-page.component.html',
  styleUrls: ['./my-modules-page.component.css'],
})
export class MyModulesPageComponent implements OnInit {
  modules$: Observable<ReadonlyArray<ModeratedModule>>
  nonEmptyModules$: Observable<boolean>

  constructor(private readonly store: Store) {
    this.modules$ = store.select(selectModeratedModules)
    this.nonEmptyModules$ = this.modules$.pipe(map((xs) => xs.length !== 0))
  }

  ngOnInit(): void {
    this.store.dispatch(MyModulesPageActions.enter())
  }

  navigateTo(path: Array<string>) {
    this.store.dispatch(NavigationActions.navigate({ path }))
  }
}
