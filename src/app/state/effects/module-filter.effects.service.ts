import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import { HttpService } from '../../http/http.service'
import { ModuleFilterAPIActions, ModuleFilterPageActions } from '../actions/module-filter.actions'
import { peopleOrd } from '../../ops/ordering.instances'

@Injectable()
export class ModuleFilterEffects {

  fetchStudyProgramAtomic$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleFilterPageActions.enter),
        exhaustMap(() =>
          this.service.allStudyPrograms().pipe(
            map((studyPrograms) => ModuleFilterAPIActions.retrievedStudyProgramsSuccess({ studyPrograms: studyPrograms }))
          )
        )
      )
    }
  )

  fetchPeople$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleFilterPageActions.enter),
        exhaustMap(() =>
          this.service.allIdentities().pipe(
            map((ps) => {
              const identities = ps.sort(peopleOrd)
              return ModuleFilterAPIActions.retrievedIdentitiesSuccess({ identities })
            })
          )
        )
      )
    }
  )

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {
  }
}
