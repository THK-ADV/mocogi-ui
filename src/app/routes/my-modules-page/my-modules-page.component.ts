import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { MyModulesPageActions } from 'src/app/state/actions/my-modules.action'
import { selectModeratedModules } from 'src/app/state/selectors/my-modules.selectors'
import { Observable } from 'rxjs'
import { ModeratedModule } from '../../types/moderated.module'

@Component({
  selector: 'cops-my-modules-page',
  templateUrl: './my-modules-page.component.html',
  styleUrls: ['./my-modules-page.component.css'],
})
export class MyModulesPageComponent implements OnInit {

  modules$: Observable<ReadonlyArray<ModeratedModule>>

  constructor(private readonly store: Store) {
    this.modules$ = store.select(selectModeratedModules)
  }

  ngOnInit(): void {
    this.store.dispatch(MyModulesPageActions.enter())
  }
}
