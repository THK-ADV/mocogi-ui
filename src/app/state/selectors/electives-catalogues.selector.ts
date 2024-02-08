import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/electives-catalogues.reducer'
import { SelectedStudyProgramId } from '../reducer/module-compendiums-filter.reducer'
import { ModuleCompendium, Semester } from "../../types/module-compendium";

export const selectElectivesCataloguesState = createFeatureSelector<State>('electivesCatalogues')

export const selectElectivesCatalogues = createSelector(
  selectElectivesCataloguesState,
  (state) => state.electivesCatalogues,
)

export const selectElectivesCataloguesFilter = createSelector(
  selectElectivesCataloguesState,
  (state) => state.cataloguesFilter,
)

export const selectSelectedSort = createSelector(
  selectElectivesCataloguesState,
  (state) => state.selectedSort,
)

function titleFilter(filter: string) {
  filter = filter.trim().toLowerCase()
  return (moduleCompendium: ModuleCompendium) =>
    moduleCompendium.studyProgram.deLabel.toLowerCase().includes(filter) ||
    moduleCompendium.studyProgram.enLabel.toLowerCase().includes(filter) ||
    moduleCompendium.semester.deLabel.toLowerCase().includes(filter) ||
    moduleCompendium.semester.enLabel.toLowerCase().includes(filter)
}

function studyProgramFilter(selectedStudyProgramId: SelectedStudyProgramId) {
  return (m: ModuleCompendium) =>
    m.studyProgram.abbrev === selectedStudyProgramId.poId
}

function semesterFilter(semester: Semester) {
  return (moduleCompendium: ModuleCompendium) =>
    moduleCompendium.semester.abbrev === semester.abbrev
}
