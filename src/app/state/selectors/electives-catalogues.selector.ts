import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/electives-catalogs.reducer'
import { SelectedStudyProgramId } from '../reducer/module-compendiums-filter.reducer'
import { Semester } from "../../types/module-compendium";
import { ElectivesCatalogue } from "../../types/electivesCatalogues";

export const selectElectivesCatalogsState = createFeatureSelector<State>('electivesCatalogs')

export const selectElectivesCatalogs = createSelector(
  selectElectivesCatalogsState,
  (state) => state.electivesCatalogs,
)

export const selectElectivesCataloguesFilter = createSelector(
  selectElectivesCatalogsState,
  (state) => state.catalogsFilter,
)

export const selectSelectedSort = createSelector(
  selectElectivesCatalogsState,
  (state) => state.selectedSort,
)

function titleFilter(filter: string) {
  filter = filter.trim().toLowerCase()
  return (moduleCompendium: ElectivesCatalogue) =>
    moduleCompendium.studyProgram.deLabel.toLowerCase().includes(filter) ||
    moduleCompendium.studyProgram.enLabel.toLowerCase().includes(filter) ||
    moduleCompendium.semester.deLabel.toLowerCase().includes(filter) ||
    moduleCompendium.semester.enLabel.toLowerCase().includes(filter)
}

function studyProgramFilter(selectedStudyProgramId: SelectedStudyProgramId) {
  return (m: ElectivesCatalogue) =>
    m.studyProgram.id === selectedStudyProgramId.poId
}

function semesterFilter(semester: Semester) {
  return (moduleCompendium: ElectivesCatalogue) =>
    moduleCompendium.semester.abbrev === semester.abbrev
}
