import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { AssessmentMethodCallback } from '../callbacks/assessment-method.callback'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { optionalLabel, requiredLabel } from './inputs'
import { mapOpt } from '../../ops/undefined-ops'
import { AssessmentMethodEntry } from '../../types/assessment-methods'
import { AssessmentMethod } from '../../types/core/assessment-method'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { showLabel } from '../../ops/show.instances'
import {Rows} from '../../form/module-form/module-form.component'

export type AssessmentMethodKind = 'mandatory' | 'optional'

export function assessmentMethodInput(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  currentEntries: (attr: string, kind: AssessmentMethodKind) => AssessmentMethodEntry[],
): Rows<unknown, unknown> {
  function assessmentMethodsMandatoryInput(): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
    return go('mandatory')
  }

  function assessmentMethodsOptionalInput(): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
    return go('optional')
  }

  function go(
    kind: AssessmentMethodKind,
  ): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
    const attr = `assessment-methods-${kind}`
    const entries = currentEntries(attr, kind)
    return {
      kind: 'read-only',
      label: label(kind),
      attr: attr,
      disabled: false,
      required: kind === 'mandatory',
      options: assessmentMethods,
      show: showAssessmentMethodEntry,
      initialValue: xs => entries.filter(a => xs.some(m => m.id === a.method)),
      dialogInstance: () => dialogInstance(attr, kind),
    }
  }

  function dialogInstance(attr: string, kind: AssessmentMethodKind) {
    const entries = currentEntries(attr, kind)
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
        <OptionsInput<AssessmentMethod>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: assessmentMethods,
          show: showLabel,
        },
        {
          kind: 'number',
          label: optionalLabel(columns[1].title),
          attr: columns[1].attr,
          disabled: false,
          required: false,
        },
        <OptionsInput<AssessmentMethod>>{
          kind: 'options',
          label: optionalLabel(columns[2].title),
          attr: columns[2].attr,
          disabled: false,
          required: false,
          data: assessmentMethods,
          show: showLabel,
        },
      ],
      entries,
    )
  }

  // TODO maybe change everything to objects
  function showAssessmentMethodEntry(e: AssessmentMethodEntry): string {
    return mapOpt(assessmentMethods.find(a => a.id === e.method), showLabel) ?? '???'
  }

  function label(kind: AssessmentMethodKind): string {
    switch (kind) {
      case 'mandatory':
        return 'Prüfungsformen für alle Pflicht Studiengänge'
      case 'optional':
        return optionalLabel('Prüfungsformen für alle als WPF belegbare Studiengänge')
    }
  }

  return {
    'assessment-methods': [{ input: assessmentMethodsMandatoryInput() as FormInput<unknown,unknown> }],
    'assessment-methods-optional': [{ input: assessmentMethodsOptionalInput() as FormInput<unknown,unknown> }],
  }
}
