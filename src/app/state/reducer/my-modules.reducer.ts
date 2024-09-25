import { createReducer, on } from '@ngrx/store'
import {
  MyModulesApiActions,
  MyModulesPageActions,
} from '../actions/my-modules.action'
import { ModeratedModule } from '../../types/moderated.module'

export interface State {
  moderatedModules: ReadonlyArray<ModeratedModule>
  error?: Error
}

const initialState: State = {
  moderatedModules: [],
  error: undefined,
}

export const myModulesReducer = createReducer(
  initialState,
  on(MyModulesPageActions.enter, (state): State => {
    return {
      ...state,
    }
  }),
  on(MyModulesPageActions.showLatestModule, (state): State => {
    return {
      ...state,
    }
  }),
  on(MyModulesApiActions.discardedChangesSuccessfully, (state): State => {
    return {
      ...state,
    }
  }),
  on(
    MyModulesApiActions.retrievedModeratedModulesSuccess,
    (state, { moderatedModules }): State => {
      return {
        ...state,
        moderatedModules,
      }
    },
  ),
  on(MyModulesApiActions.requestedReviewSuccessfully, (state): State => {
    return {
      ...state,
    }
  }),
  on(MyModulesApiActions.retrievedError, (state, { error }): State => {
    return {
      ...state,
      error,
    }
  }),
  on(MyModulesApiActions.retrievedError, (state, { error }): State => {
    return {
      ...state,
      error,
    }
  }),
)
