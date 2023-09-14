import { createFeatureSelector, createSelector } from '@ngrx/store'
import { State } from '../reducer/my-modules.reducer'
import { Module } from 'src/app/types/module'
import { ModuleDraft } from 'src/app/types/module-draft'

enum ModuleStatus {
  UNKNOWN,
  PUBLISHED
}

export type ModeratedModule = { module: Module, moduleDraft:ModuleDraft | undefined, status: ModuleStatus }

const selectMyModulesState = createFeatureSelector<State>('myModules')

const selectModules = createSelector(
  selectMyModulesState,
  (state) => state.modules,
)

const selectModuleDrafts = createSelector(
  selectMyModulesState,
  (state) => state.moduleDrafts,
)

const defineModuleStatus = (module: Module, moduleDraft: ModuleDraft | undefined): ModuleStatus => {
  if (moduleDraft === undefined) return ModuleStatus.PUBLISHED
  return ModuleStatus.UNKNOWN
}

export const selectModulesWithModuleDrafts = createSelector(
  selectModules,
  selectModuleDrafts,
  (modules, moduleDrafts) => {
    const res: ModeratedModule[] = modules.map((module) => {
      const moduleDraft = moduleDrafts.find((moduleDraft) => module.id === moduleDraft.module)
      return {
        module: module,
        moduleDraft: moduleDraft,
        status: defineModuleStatus(module, moduleDraft),
      }
    })
    return res
  } 
)