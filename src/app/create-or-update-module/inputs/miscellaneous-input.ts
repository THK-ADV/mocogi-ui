import { optionalLabel, requiredLabel } from './inputs'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { ModuleCallback } from '../callbacks/module-callback'
import { ModuleCore } from '../../types/moduleCore'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { showModule } from '../../ops/show.instances'
import { Rows } from '../../form/module-form/module-form.component'

export function miscellaneousInput(
  dialog: MatDialog,
  modules: ModuleCore[],
  currentTaughtWith: (attr: string) => ModuleCore[],
): Rows<unknown, unknown> {
  function taughtWithDialogInstance(attr: string) {
    const columns = [{ attr: 'module', title: $localize`Modul` }]
    const entries = currentTaughtWith(attr)
    const callback = new ModuleCallback(
      modules,
      entries,
      columns[0].attr,
      showModule,
    )

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      $localize`Zusammen gelehrte Module bearbeiten`,
      [
        <OptionsInput<ModuleCore>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: modules,
          show: showModule,
          id: (a) => a.id,
        },
      ],
      entries,
    )
  }

  function taughtWithInput(): ReadOnlyInput<ModuleCore, ModuleCore> {
    const attr = 'taught-with'
    const entries = currentTaughtWith(attr)
    return {
      kind: 'read-only',
      label: optionalLabel($localize`Wird gelehrt mit`),
      attr: attr,
      disabled: false,
      required: false,
      options: modules,
      show: showModule,
      initialValue: (xs) =>
        entries.filter((a) => xs.some((m) => m.id === a.id)),
      dialogInstance: () => taughtWithDialogInstance(attr),
    }
  }

  return {
    taughtWithInput: [
      { input: taughtWithInput() as FormInput<unknown, unknown> },
    ],
  }
}
