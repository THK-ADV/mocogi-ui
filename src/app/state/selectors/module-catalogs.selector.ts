import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-catalogs.reducer'
import { ModuleCatalog } from '../../types/module-compendium'
import { selectSelectedStudyProgramId } from './module-compendiums-filter.selectors'

export const selectModuleCompendiumsState = createFeatureSelector<State>('moduleCatalogs')

export const selectModuleCompendiums = createSelector(
  selectModuleCompendiumsState,
  selectSelectedStudyProgramId,
  (state, studyProgramId) => {
    if (studyProgramId) return state.moduleCatalogs.filter((c) => c.studyProgram.id === studyProgramId)
    return state.moduleCatalogs
  },
)

function titleFilter(filter: string) {
  filter = filter.trim().toLowerCase()
  return (moduleCompendium: ModuleCatalog) =>
    moduleCompendium.studyProgram.deLabel.toLowerCase().includes(filter) ||
    moduleCompendium.studyProgram.enLabel.toLowerCase().includes(filter) ||
    moduleCompendium.semester.deLabel.toLowerCase().includes(filter) ||
    moduleCompendium.semester.enLabel.toLowerCase().includes(filter)
}
