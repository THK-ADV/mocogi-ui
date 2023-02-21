import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import { HttpService } from '../../http/http.service'
import { ModuleFilterAPIActions, ModuleFilterPageActions } from '../actions/module-filter.actions'

@Injectable()
export class ModuleFilterEffects {

  fetchStudyPrograms$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleFilterPageActions.enter),
        exhaustMap(() =>
          this.service.allStudyPrograms().pipe(
            map((studyPrograms) =>
              ModuleFilterAPIActions.retrievedStudyprogramsSuccess({studyPrograms})
            )
          )
        )
      )
    }
  )

  fetchPOs$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleFilterPageActions.enter),
        exhaustMap(() =>
          this.service.allValidPOs().pipe(
            map((pos) =>
              ModuleFilterAPIActions.retrievedPosSuccess({pos})
            )
          )
        )
      )
    }
  )

  fetchGrades$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleFilterPageActions.enter),
        exhaustMap(() =>
          this.service.allGrades().pipe(
            map((grades) =>
              ModuleFilterAPIActions.retrievedGradesSuccess({grades})
            )
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
            map((people) =>
              ModuleFilterAPIActions.retrievedPeopleSuccess({people})
            )
          )
        )
      )
    }
  )

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions
  ) {
  }
}
