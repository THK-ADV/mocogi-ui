import { AssessmentMethod, AssessmentMethodEntry } from '../../http/http.service'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { AssessmentMethodCallback } from '../callbacks/assessment-method.callback'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { MatDialog } from '@angular/material/dialog'

// TODO apply döner pattern?

export function assessmentMethodsInput(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  currentEntries: () => AssessmentMethodEntry[],
): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
  const entries = currentEntries()
  return {
    kind: 'read-only',
    label: 'Prüfungsformen',
    attr: 'assessment-methods-mandatory',
    disabled: false,
    required: true,
    options: assessmentMethods,
    show: (e) => assessmentMethods.find(a => a.abbrev === e.method)?.deLabel ?? '???', // TODO maybe change everything to objects
    initialValue: xs => entries.filter(a => xs.some(m => m.abbrev === a.method)),
    dialogInstance: () => assessmentMethodsDialogInstance(dialog, assessmentMethods, currentEntries)
  }
}

function assessmentMethodsDialogInstance(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  currentEntries: () => AssessmentMethodEntry[],
) {
  const entries = currentEntries()
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
        label: columns[0].title + ' *',
        attr: columns[0].attr,
        disabled: false,
        required: false,
        data: assessmentMethods,
        show: (a) => a.deLabel,
      },
      {
        kind: 'number',
        label: columns[1].title + ' (Optional)',
        attr: columns[1].attr,
        disabled: false,
        required: false
      },
      {
        kind: 'options',
        label: columns[2].title + ' (Optional)',
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
