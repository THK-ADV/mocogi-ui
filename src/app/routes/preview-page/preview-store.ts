import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
import { StudyProgramPrivileges } from '../../types/study-program-privileges'
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { pipe, switchMap } from 'rxjs'
import { inject } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { tapResponse } from '@ngrx/operators'
import { Ordering } from '../../ops/ordering'
import { numberOrd, stringOrd } from '../../ops/ordering.instances'

function ordering() {
  return Ordering.many<StudyProgramPrivileges>([
    Ordering.contraMap(stringOrd, (p) => p.studyProgram.id),
    Ordering.contraMap(stringOrd, (p) => p.studyProgram.degree.id),
    Ordering.contraMap(numberOrd, (p) => p.studyProgram.po.version),
  ])
}

export const PreviewStore = signalStore(
  withState({ privileges: new Array<StudyProgramPrivileges>() }),
  withMethods((store, http = inject(HttpService)) => {
    return {
      load: rxMethod<void>(
        pipe(
          switchMap(() =>
            http.getPersonalData().pipe(
              tapResponse({
                next: (xs) => {
                  const privileges = xs.privileges.filter(
                    (a) => !a.studyProgram.specialization,
                  )
                  privileges.sort(ordering())
                  patchState(store, { privileges })
                },
                error: (err) => console.error(err),
              }),
            ),
          ),
        ),
      ),
    }
  }),
)
