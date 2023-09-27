import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/my-modules.reducer'

// const ModuleUpdateStatus = {
//   'waitingForApproval': { label: 'Waiting for approval', color: 'secondary'},
//   'waitingForPublication': { label: 'Will be published on 12.12.2023', color: 'primary'},
//   'invalid': { label: 'Invalid draft', color: 'primary'},
//   'validForReview': { label: 'Valid for publication', color: 'primary'},
//   'validForPublication': { label: 'Valid for review', color: 'primary'},
//   'published': { label: 'Published', color: 'primary'},
// }

// canDiscard = ([, d]: [Module, ModuleDraft | undefined]) =>
//   d && d.mergeRequestId == null
//
// canSubmitReview = ([, d]: [Module, ModuleDraft | undefined]) =>
//   d && d.mergeRequestId == null
//
// canEdit = ([, d]: [Module, ModuleDraft | undefined]) =>
//   d?.mergeRequestId == null


const selectMyModulesState = createFeatureSelector<State>('myModules')

export const selectModeratedModules = createSelector(
  selectMyModulesState,
  (state) => state.moderatedModules,
)
