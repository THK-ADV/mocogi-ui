import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { optionalLabel, requiredLabel } from './inputs'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { ModuleCallback } from '../callbacks/module-callback'
import { PrerequisitesPoCallback } from '../callbacks/prerequisites-po-callback'
import { POPreview } from '../../types/pos'
import { Module } from '../../types/module'
import { PrerequisitesOutput } from '../../types/prerequisites'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { showModule } from '../../ops/show.instances'

export type PrerequisitesKind = 'required' | 'recommended'

export function prerequisitesInputs(
  dialog: MatDialog,
  allModules: Module[],
  currentModules: (attr: string, kind: PrerequisitesKind) => Module[],
  allPOs: POPreview[],
  currentPOs: (attr: string, kind: PrerequisitesKind) => POPreview[],
  prerequisites?: PrerequisitesOutput,
) {
  function requiredPrerequisitesText(): TextAreaInput {
    return text('required', prerequisites?.required?.text)
  }

  function recommendedPrerequisitesText(): TextAreaInput {
    return text('recommended', prerequisites?.recommended?.text)
  }

  function requiredPrerequisitesModules(): ReadOnlyInput<Module, Module> {
    return modules('required')
  }

  function recommendedPrerequisitesModules(): ReadOnlyInput<Module, Module> {
    return modules('recommended')
  }

  function requiredPrerequisitesPOs(): ReadOnlyInput<POPreview, POPreview> {
    return studyPrograms('required')
  }

  function recommendedPrerequisitesPOs(): ReadOnlyInput<POPreview, POPreview> {
    return studyPrograms('recommended')
  }

  function text(kind: PrerequisitesKind, initialValue?: string): TextAreaInput {
    return {
      kind: 'text-area',
      label: optionalLabel(`${labelPrefix(kind)} Freitext`),
      attr: `${kind}-prerequisites-text`,
      disabled: false,
      required: false,
      initialValue: initialValue,
    }
  }

  function modules(kind: PrerequisitesKind): ReadOnlyInput<Module, Module> {
    const attr = `${kind}-prerequisites-modules`
    const entries = currentModules(attr, kind)
    return {
      kind: 'read-only',
      label: optionalLabel(`${labelPrefix(kind)} Module`),
      attr: attr,
      disabled: false,
      required: false,
      options: allModules,
      show: showModule,
      initialValue: xs => xs.filter(x => entries.some(e => e.id === x.id)),
      dialogInstance: () => moduleDialogInstance(attr, kind),
    }
  }

  function studyPrograms(kind: PrerequisitesKind): ReadOnlyInput<POPreview, POPreview> {
    const attr = `${kind}-prerequisites-po`
    const entries = currentPOs(attr, kind)
    return {
      kind: 'read-only',
      label: optionalLabel(`${labelPrefix(kind)} Studiengänge`),
      attr: attr,
      disabled: false,
      required: false,
      options: allPOs,
      show: showPO,
      initialValue: xs => xs.filter(x => entries.some(e => e.id === x.id)),
      dialogInstance: () => poDialogInstance(attr, kind),
    }
  }

  function moduleDialogInstance(attr: string, kind: PrerequisitesKind) {
    const columns = [{attr: 'module', title: 'Modul'}]
    const entries = currentModules(attr, kind)
    const callback = new ModuleCallback(allModules, entries, columns[0].attr, showModule)

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      'Module bearbeiten',
      [
        <OptionsInput<Module>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: allModules,
          show: showModule,
        },
      ],
      entries,
    )
  }

  function poDialogInstance(attr: string, kind: PrerequisitesKind) {
    const columns = [{attr: 'po', title: 'Studiengang mit PO'}]
    const entries = currentPOs(attr, kind)
    const callback = new PrerequisitesPoCallback(allPOs, entries, columns[0].attr, showPO)

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      'Studiengänge bearbeiten',
      [
        <OptionsInput<POPreview>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: allPOs,
          show: showPO,
        },
      ],
      entries,
    )
  }

  function labelPrefix(kind: PrerequisitesKind): string {
    switch (kind) {
      case 'required':
        return 'Zwingende Voraussetzungen'
      case 'recommended':
        return 'Empfohlene Voraussetzungen'
    }
  }

  function showPO(po: POPreview): string {
    return po.label
  }

  return <FormInput<unknown, unknown>[]>[
    requiredPrerequisitesText(),
    requiredPrerequisitesModules(),
    requiredPrerequisitesPOs(),
    recommendedPrerequisitesText(),
    recommendedPrerequisitesModules(),
    recommendedPrerequisitesPOs(),
  ]
}
