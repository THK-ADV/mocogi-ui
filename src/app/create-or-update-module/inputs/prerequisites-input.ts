import { TextInput } from '../../form/plain-input/plain-input.component'
import { optionalLabel, requiredLabel } from './inputs'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { MatDialog } from '@angular/material/dialog'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { ModuleCallback } from '../callbacks/module-callback'
import { ModuleCore } from '../../types/moduleCore'
import { PrerequisitesOutput } from '../../types/prerequisites'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { showModule } from '../../ops/show.instances'
import { Rows } from '../../form/module-form/module-form.component'
import { StudyProgram } from '../../types/module-compendium'

export type PrerequisitesKind = 'required' | 'recommended'

export function prerequisitesInputs(
  dialog: MatDialog,
  allModules: ModuleCore[],
  currentModules: (attr: string, kind: PrerequisitesKind) => ModuleCore[],
  studyPrograms: StudyProgram[],
  prerequisites?: PrerequisitesOutput,
): Rows<unknown, unknown> {
  function labelPrefix(kind: PrerequisitesKind): string {
    switch (kind) {
      case 'required':
        return $localize`Zwingende Voraussetzungen`
      case 'recommended':
        return $localize`Empfohlene Voraussetzungen`
    }
  }

  function text(kind: PrerequisitesKind, initialValue?: string): TextInput {
    return {
      kind: 'text',
      label: optionalLabel($localize`${labelPrefix(kind)} Freitext`),
      attr: `${kind}-prerequisites-text`,
      disabled: false,
      required: false,
      initialValue: initialValue,
    }
  }

  function moduleDialogInstance(attr: string, kind: PrerequisitesKind) {
    const columns = [{ attr: 'module', title: $localize`Modul` }]
    const entries = currentModules(attr, kind)
    const callback = new ModuleCallback(
      allModules,
      entries,
      columns[0].attr,
      showModule,
    )

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      'Module bearbeiten',
      [
        <OptionsInput<ModuleCore>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: allModules,
          show: showModule,
          id: (a) => a.id,
        },
      ],
      entries,
    )
  }

  function modules(
    kind: PrerequisitesKind,
  ): ReadOnlyInput<ModuleCore, ModuleCore> {
    const attr = `${kind}-prerequisites-modules`
    const entries = currentModules(attr, kind)
    return {
      kind: 'read-only',
      label: optionalLabel($localize`${labelPrefix(kind)} Module`),
      attr: attr,
      disabled: false,
      required: false,
      options: allModules,
      show: showModule,
      initialValue: (xs) =>
        xs.filter((x) => entries.some((e) => e.id === x.id)),
      dialogInstance: () => moduleDialogInstance(attr, kind),
    }
  }

  function requiredPrerequisitesText(): TextInput {
    return text('required', prerequisites?.required?.text)
  }

  function recommendedPrerequisitesText(): TextInput {
    return text('recommended', prerequisites?.recommended?.text)
  }

  function requiredPrerequisitesModules(): ReadOnlyInput<
    ModuleCore,
    ModuleCore
  > {
    return modules('required')
  }

  function recommendedPrerequisitesModules(): ReadOnlyInput<
    ModuleCore,
    ModuleCore
  > {
    return modules('recommended')
  }

  return {
    'required-prerequisites-text': [
      { input: requiredPrerequisitesText() as FormInput<unknown, unknown> },
    ],
    'required-prerequisites-modules': [
      { input: requiredPrerequisitesModules() as FormInput<unknown, unknown> },
    ],
    'recommended-prerequisites-text': [
      { input: recommendedPrerequisitesText() as FormInput<unknown, unknown> },
    ],
    'recommended-prerequisites-modules': [
      {
        input: recommendedPrerequisitesModules() as FormInput<unknown, unknown>,
      },
    ],
  }
}
