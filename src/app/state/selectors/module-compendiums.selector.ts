import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/module-compendiums.reducer'
import { SelectedStudyProgramId } from '../reducer/module-compendiums-filter.reducer'
import { ModuleCompendium, Semester } from "../../types/module-compendium";

export const selectModuleCompendiumsState = createFeatureSelector<State>('moduleCompendiums')

export const selectModuleCompendiums = createSelector(
  selectModuleCompendiumsState,
  (state) => state.moduleCompendiums,
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

function studyProgramSemesterFilter(selectedStudyProgramId: SelectedStudyProgramId, semester: Semester) {
  return (mc: ModuleCompendium) => studyProgramFilter(selectedStudyProgramId)(mc) && semesterFilter(semester)(mc)
}
