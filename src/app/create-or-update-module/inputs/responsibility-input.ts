import { OptionsInput } from '../../form/options-input/options-input.component'
import { MatDialog } from '@angular/material/dialog'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { LecturerCallback } from '../callbacks/lecturer-callback'
import { requiredLabel } from './inputs'
import { Identity } from '../../types/core/person'
import { showPerson } from '../../ops/show.instances'
import { Rows } from '../../form/module-form/module-form.component'
import { FormInput } from '../../form/form-input'

export function responsibilityInput(
  dialog: MatDialog,
  persons: Identity[],
  currentLecturer: (attr: string) => Identity[],
  moduleManagement?: string[],
): Rows<unknown, unknown> {
  function moduleCoordinatorInput(): OptionsInput<Identity> {
    return {
      kind: 'options',
      label: $localize`Modulverantwortliche*r`,
      attr: 'moduleCoordinator',
      disabled: false,
      required: true,
      data: persons,
      show: showPerson,
      initialValue: moduleManagement && (as => as.find(a => moduleManagement.some(m => m === a.id))),
    }
  }

  function lecturerInput(): ReadOnlyInput<Identity, Identity> {
    const attr = 'lecturer'
    const entries = currentLecturer(attr)
    return {
      kind: 'read-only',
      label: $localize`Dozierende`,
      attr: attr,
      disabled: false,
      required: true,
      options: persons,
      show: showPerson,
      initialValue: xs => entries.filter(p => xs.some(x => x.id === p.id)),
      dialogInstance: () => dialogInstance(attr),
    }
  }

  function dialogInstance(attr: string) {
    const columns = [{attr: 'person', title: $localize`Dozierende`}]
    const entries = currentLecturer(attr)
    const callback = new LecturerCallback(persons, entries, columns[0].attr, showPerson)

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      $localize`Dozierende bearbeiten`,
      [
        <OptionsInput<Identity>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: persons,
          show: showPerson,
        },
      ],
      entries,
    )
  }

  return {
    'moduleCoordinator': [{input: moduleCoordinatorInput() as FormInput<unknown, unknown>}],
    'lecturer': [{input: lecturerInput() as FormInput<unknown, unknown>}],
  }
}


