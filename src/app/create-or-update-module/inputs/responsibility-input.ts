import { OptionsInput } from '../../form/options-input/options-input.component'
import { MatDialog } from '@angular/material/dialog'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { LecturerCallback } from '../callbacks/lecturer-callback'
import { requiredLabel } from './inputs'
import { FormInput } from '../../form/form-input'
import { Person } from '../../types/core/person'

export function responsibilityInput(
  dialog: MatDialog,
  persons: Person[],
  currentLecturer: (attr: string) => Person[],
  moduleManagement?: string[]
): FormInput[] {
  function moduleCoordinatorInput(): OptionsInput<Person> {
    return {
      kind: 'options',
      label: 'Modulverantwortliche*r',
      attr: 'moduleCoordinator',
      disabled: false,
      required: true,
      data: persons,
      show: showPerson,
      initialValue: moduleManagement && (as => as.find(a => moduleManagement.some(m => m === a.id)))
    }
  }

  function lecturerInput(): ReadOnlyInput<Person, Person> {
    const attr = 'lecturer'
    const entries = currentLecturer(attr)
    return {
      kind: 'read-only',
      label: 'Dozierende',
      attr: attr,
      disabled: false,
      required: true,
      options: persons,
      show: showPerson,
      initialValue: xs => entries.filter(p => xs.some(x => x.id === p.id)),
      dialogInstance: () => dialogInstance(attr)
    }
  }

  function dialogInstance(attr: string) {
    const columns = [{attr: 'person', title: 'Dozierende'}]
    const entries = currentLecturer(attr)
    const callback = new LecturerCallback(persons, entries, columns[0].attr, showPerson)

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      'Dozierende bearbeiten',
      [
        {
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: persons,
          show: showPerson,
        }
      ],
      entries
    )
  }

  function showPerson(p: Person): string {
    switch (p.kind) {
      case 'single':
        return `${p.lastname}, ${p.firstname}`
      case 'group':
        return p.title
      case 'unknown':
        return p.title
    }
  }

  return [
    moduleCoordinatorInput(),
    lecturerInput()
  ]
}


