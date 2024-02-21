import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import { HttpService } from '../../http/http.service'
import { generateCurrentSemester } from '../../helper/semester.helper'
import {
  ElectivesCatalogsFilterAPIActions,
  ElectivesCatalogsFilterComponentActions,
} from '../actions/electives-catalogs-filter.actions'
import { ElectivesCatalogsApiActions } from '../actions/electives-catalogues.actions'

@Injectable()
export class ElectivesCatalogsFilterEffects {
    fetchSemesters$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ElectivesCatalogsFilterComponentActions.enter),
        exhaustMap(() => {
          console.log('PINGPONG')
          return this.service.getSemesters().pipe(
            map((semesters) => ElectivesCatalogsFilterAPIActions.retrievedSemestersSuccess({ semesters }))
          )
        }
        )
      )
    }
  )

  updateSelectedSemester$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ElectivesCatalogsFilterComponentActions.selectSemester),
      exhaustMap(({ semester }) => this.service.allElectivesCatalogues(semester.id).pipe(map((electivesCatalogues) => ElectivesCatalogsApiActions.retrievedElectivesCatalogsSuccess({ electivesCatalogues }))
      )))
  })

  resetSemester = createEffect(() => {
    return this.actions$.pipe(
      ofType(ElectivesCatalogsFilterComponentActions.deselectSemester, ElectivesCatalogsFilterComponentActions.resetFilter),
      map(() => ElectivesCatalogsFilterComponentActions.selectSemester({semester: generateCurrentSemester()})))
  })

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {
  }
}
