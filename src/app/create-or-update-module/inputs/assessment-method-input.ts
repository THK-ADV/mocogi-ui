import { AssessmentMethod, AssessmentMethodEntry } from '../../http/http.service'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { AssessmentMethodCallback } from '../callbacks/assessment-method.callback'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { optionalLabel, requiredLabel } from '../create-or-update-module.component'

// TODO apply döner pattern?

export function assessmentMethodsMandatoryInput(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  currentEntries: (attr: string) => AssessmentMethodEntry[],
): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
  return go(
    dialog,
    assessmentMethods,
    currentEntries,
    'Prüfungsformen für alle Pflicht Studiengänge',
    'assessment-methods-mandatory',
    true
  )
}

export function assessmentMethodsOptionalInput(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  currentEntries: (attr: string) => AssessmentMethodEntry[],
): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
  return go(
    dialog,
    assessmentMethods,
    currentEntries,
    optionalLabel('Prüfungsformen für alle als WPF belegbare Studiengänge'),
    'assessment-methods-optional',
    false
  )
}

function go(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  currentEntries: (attr: string) => AssessmentMethodEntry[],
  label: string,
  attr: string,
  required: boolean
): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
  const entries = currentEntries(attr)
  return {
    kind: 'read-only',
    label: label,
    attr: attr,
    disabled: false,
    required: required,
    options: assessmentMethods,
    show: (e) => assessmentMethods.find(a => a.abbrev === e.method)?.deLabel ?? '???', // TODO maybe change everything to objects
    initialValue: xs => entries.filter(a => xs.some(m => m.abbrev === a.method)),
    dialogInstance: () => assessmentMethodsDialogInstance(dialog, assessmentMethods, attr, currentEntries)
  }
}

function assessmentMethodsDialogInstance(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  attr: string,
  currentEntries: (attr: string) => AssessmentMethodEntry[],
) {
  const entries = currentEntries(attr)
  const callback = new AssessmentMethodCallback(assessmentMethods, entries)
  const columns = [
    {attr: 'method', title: 'Prüfungsform'},
    {attr: 'percentage', title: 'Prozentualer Anteil'},
    {attr: 'precondition', title: 'Vorbedingungen'},
  ]

  return MultipleEditDialogComponent.instance(
    dialog,
    callback,
    columns,
    'Prüfungsformen bearbeiten',
    [
      {
        kind: 'options',
        label: requiredLabel(columns[0].title),
        attr: columns[0].attr,
        disabled: false,
        required: false,
        data: assessmentMethods,
        show: (a) => a.deLabel,
      },
      {
        kind: 'number',
        label: optionalLabel(columns[1].title),
        attr: columns[1].attr,
        disabled: false,
        required: false
      },
      {
        kind: 'options',
        label: optionalLabel(columns[2].title),
        attr: columns[2].attr,
        disabled: false,
        required: false,
        data: assessmentMethods,
        show: (a) => a.deLabel,
      }
    ],
    entries
  )
}
