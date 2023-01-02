import { Metadata, Person } from '../../http/http.service'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { MatDialog } from '@angular/material/dialog'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { LecturerCallback } from '../callbacks/lecturer-callback'
import { requiredLabel } from './inputs'

export const moduleCoordinatorInput = (persons: Person[], metadata?: Metadata): OptionsInput<Person> =>
  ({
    kind: 'options',
    label: 'Modulverantwortliche*r',
    attr: 'moduleCoordinator',
    disabled: false,
    required: true,
    data: persons,
    show: showPerson,
    initialValue: metadata && (as => as.find(a => metadata.moduleManagement.some(m => m === a.id)))
  })

export function lecturerInput(
  dialog: MatDialog,
  persons: Person[],
  currentPersons: (attr: string) => Person[],
): ReadOnlyInput<Person, Person> {
  const attr = 'lecturer'
  const entries = currentPersons(attr)
  return {
    kind: 'read-only',
    label: 'Dozierende',
    attr: attr,
    disabled: false,
    required: true,
    options: persons,
    show: showPerson,
    initialValue: xs => entries.filter(p => xs.some(x => x.id === p.id)),
    dialogInstance: () => dialogInstance(dialog, persons, attr, currentPersons)
  }
}

function dialogInstance(
  dialog: MatDialog,
  persons: Person[],
  attr: string,
  currentPersons: (attr: string) => Person[],
) {
  const columns = [{attr: 'person', title: 'Dozierende'}]
  const entries = currentPersons(attr)
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

export const showPerson = (p: Person): string => {
  switch (p.kind) {
    case 'single':
      return `${p.lastname}, ${p.firstname}`
    case 'group':
      return p.title
    case 'unknown':
      return p.title
  }
}
