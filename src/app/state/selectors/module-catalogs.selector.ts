import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-catalogs.reducer'
import { SelectedStudyProgramId } from '../reducer/module-compendiums-filter.reducer'
import { ModuleCatalog, Semester } from "../../types/module-compendium";

export const selectModuleCompendiumsState = createFeatureSelector<State>('moduleCatalogs')

export const selectModuleCompendiums = createSelector(
  selectModuleCompendiumsState,
  (state) => state.moduleCatalogs,
)

export const selectModuleCompendiumsFilter = createSelector(
  selectModuleCompendiumsState,
  (state) => state.moduleFilter,
)

export const selectSelectedSort = createSelector(
  selectModuleCompendiumsState,
  (state) => state.selectedSort,
)

function titleFilter(filter: string) {
  filter = filter.trim().toLowerCase()
  return (moduleCompendium: ModuleCatalog) =>
    moduleCompendium.studyProgram.deLabel.toLowerCase().includes(filter) ||
    moduleCompendium.studyProgram.enLabel.toLowerCase().includes(filter) ||
    moduleCompendium.semester.deLabel.toLowerCase().includes(filter) ||
    moduleCompendium.semester.enLabel.toLowerCase().includes(filter)
}

function studyProgramFilter(selectedStudyProgramId: SelectedStudyProgramId) {
  return (m: ModuleCatalog) =>
    m.studyProgram.id === selectedStudyProgramId.poId
}

function semesterFilter(semester: Semester) {
  return (moduleCompendium: ModuleCatalog) =>
    moduleCompendium.semester.abbrev === semester.abbrev
}

function studyProgramSemesterFilter(selectedStudyProgramId: SelectedStudyProgramId, semester: Semester) {
  return (mc: ModuleCatalog) => studyProgramFilter(selectedStudyProgramId)(mc) && semesterFilter(semester)(mc)
}
