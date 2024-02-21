import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { exhaustMap, map } from 'rxjs'
import { HttpService } from '../../http/http.service'
import {
  ModuleCompendiumsFilterAPIActions,
  ModuleCompendiumsFilterComponentActions,
} from '../actions/module-compendiums-filter.actions'
import { ModuleCatalogsApiActions } from '../actions/module-catalogs.actions'
import { generateCurrentSemester } from '../../helper/semester.helper'

@Injectable()
export class ModuleCompendiumsFilterEffects {

  fetchStudyPrograms$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleCompendiumsFilterComponentActions.enter),
        exhaustMap(() =>
          this.service.allStudyPrograms().pipe(
            map((studyPrograms) => ModuleCompendiumsFilterAPIActions.retrievedStudyProgramsSuccess({studyPrograms}))
          )
        )
      )
    }
  )

  fetchSemesters$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ModuleCompendiumsFilterComponentActions.enter),
        exhaustMap(() =>
          this.service.getSemesters().pipe(
            map((semesters) => ModuleCompendiumsFilterAPIActions.retrievedSemestersSuccess({ semesters }))
          )
        )
      )
    }
  )

  updateSelectedSemester$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ModuleCompendiumsFilterComponentActions.selectSemester),
      exhaustMap(({ semester }) => this.service.allModuleCatalogs(semester.id).pipe(map((moduleCatalogs) => ModuleCatalogsApiActions.retrievedModulesCatalogsSuccess({ moduleCatalogs }))
    )))
  })

  resetSemester = createEffect(() => {
    return this.actions$.pipe(
      ofType(ModuleCompendiumsFilterComponentActions.deselectSemester, ModuleCompendiumsFilterComponentActions.resetFilter),
      map(() => ModuleCompendiumsFilterComponentActions.selectSemester({semester: generateCurrentSemester()})))
  })

  constructor(
    private readonly service: HttpService,
    private readonly actions$: Actions,
  ) {
  }
}
