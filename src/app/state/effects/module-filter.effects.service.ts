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
          this.service.allStudyProgramAtomic().pipe(
            map((studyPrograms) => ModuleFilterAPIActions.retrievedStudyprogramsSuccess({studyPrograms}))
          )
        )
      )
    }
  )

  fetchPeople$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleFilterPageActions.enter),
        exhaustMap(() =>
          this.service.allPersons().pipe(
            map((ps) => {
              const people = ps.sort(peopleOrd)
              return ModuleFilterAPIActions.retrievedPeopleSuccess({people})
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
