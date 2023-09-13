import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/my-modules.reducer'
import { Module } from 'src/app/types/module'
import { ModuleDraft } from 'src/app/types/module-draft'

const selectMyModulesState = createFeatureSelector<State>('myModules')

const selectModules = createSelector(
  selectMyModulesState,
  (state) => state.modules,
)

const selectModuleDrafts = createSelector(
  selectMyModulesState,
  (state) => state.moduleDrafts,
)

export const selectModulesWithModuleDrafts = createSelector(
  selectModules,
  selectModuleDrafts,
  (modules, moduleDrafts) => {
    const res: [Module, ModuleDraft | undefined][] = modules.map((module) => [
      module,
      moduleDrafts.find((moduleDraft) => module.id === moduleDraft.module),
    ])
    return res
  } 
)