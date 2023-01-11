import { FormInput } from '../../form/form-input'
import { optionalLabel, requiredLabel } from './inputs'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { CompetenceCallback } from '../callbacks/competence-callback'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { GlobalCriteriaCallback } from '../callbacks/global-criteria-callback'
import { ModuleCallback } from '../callbacks/module-callback'
import { showLabel, showModule } from '../../ops/show-instances'
import { GlobalCriteria } from '../../types/core/global-criteria'
import { Competence } from '../../types/core/competence'
import { Module } from '../../types/module'

export function miscellaneousInput(
  dialog: MatDialog,
  competences: Competence[],
  modules: Module[],
  globalCriteria: GlobalCriteria[],
  currentCompetences: (attr: string) => Competence[],
  currentGlobalCriteria: (attr: string) => GlobalCriteria[],
  currentTaughtWith: (attr: string) => Module[],
): FormInput[] {
  function competenceInput(): ReadOnlyInput<Competence, Competence> {
    const attr = 'competences'
    const entries = currentCompetences(attr)
    return {
      kind: 'read-only',
      label: optionalLabel('Kompetenzen'),
      attr: attr,
      disabled: false,
      required: false,
      options: competences,
      show: showLabel,
      initialValue: xs => entries.filter(a => xs.some(m => m.abbrev === a.abbrev)),
      dialogInstance: () => competenceDialogInstance(attr)
    }
  }

  function globalCriteriaInput(): ReadOnlyInput<GlobalCriteria, GlobalCriteria> {
    const attr = 'global-criteria'
    const entries = currentGlobalCriteria(attr)
    return {
      kind: 'read-only',
      label: optionalLabel('Globale Kriterien'),
      attr: attr,
      disabled: false,
      required: false,
      options: globalCriteria,
      show: showLabel,
      initialValue: xs => entries.filter(a => xs.some(m => m.abbrev === a.abbrev)),
      dialogInstance: () => globalCriteriaDialogInstance(attr)
    }
  }

  function taughtWithInput(): ReadOnlyInput<Module, Module> {
    const attr = 'taught-with'
    const entries = currentTaughtWith(attr)
    return {
      kind: 'read-only',
      label: optionalLabel('Wird gelehrt mit'),
      attr: attr,
      disabled: false,
      required: false,
      options: modules,
      show: showModule,
      initialValue: xs => entries.filter(a => xs.some(m => m.id === a.id)),
      dialogInstance: () => taughtWithDialogInstance(attr)
    }
  }

  function competenceDialogInstance(attr: string) {
    const columns = [{attr: 'competence', title: 'Kompetenzen'}]
    const entries = currentCompetences(attr)
    const callback = new CompetenceCallback(competences, entries, columns[0].attr, showLabel)

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      'Kompetenzen bearbeiten',
      [
        {
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: competences,
          show: showLabel,
        }
      ],
      entries
    )
  }

  function globalCriteriaDialogInstance(attr: string) {
    const columns = [{attr: 'global-criteria', title: 'Globale Kriterien'}]
    const entries = currentGlobalCriteria(attr)
    const callback = new GlobalCriteriaCallback(globalCriteria, entries, columns[0].attr, showLabel)

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      'Globale Kriterien bearbeiten',
      [
        {
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: globalCriteria,
          show: showLabel,
        }
      ],
      entries
    )
  }

  function taughtWithDialogInstance(attr: string) {
    const columns = [{attr: 'module', title: 'Modul'}]
    const entries = currentTaughtWith(attr)
    const callback = new ModuleCallback(modules, entries, columns[0].attr, showModule)

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      'Zusammen gelehrte Module bearbeiten',
      [
        {
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: modules,
          show: showModule,
        }
      ],
      entries
    )
  }

  return [
    competenceInput(),
    globalCriteriaInput(),
    taughtWithInput()
  ]
}