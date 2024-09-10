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
import { showLabel, showPerson } from '../../ops/show.instances'
import { Rows } from '../../form/module-form/module-form.component'
import { Identity } from '../../types/core/person'
import { ExamPhase } from '../../types/core/exam-phase'
import { ExamPhasesCallback } from '../callbacks/ExamPhasesCallback'
import { MetadataLike } from '../../types/metadata'

export type AssessmentMethodKind = 'mandatory' | 'optional'

export function assessmentInput(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  currentEntries: (attr: string, kind: AssessmentMethodKind) => AssessmentMethodEntry[],
  examPhases: ExamPhase[],
  currentExamPhases: (attr: string) => ExamPhase[],
  identities: Identity[],
  metadata: MetadataLike | undefined,
): Rows<unknown, unknown> {

  const examiner = identities.filter(a => a.kind !== 'group')

  function assessmentMethodsMandatoryInput(): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
    return go('mandatory')
  }

  function assessmentMethodsOptionalInput(): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
    return go('optional')
  }

  function examPhasesInput(): ReadOnlyInput<ExamPhase, ExamPhase> {
    const attr = 'exam-phases'
    const entries = currentExamPhases(attr)
    return {
      kind: 'read-only',
      label: 'Prüfungsphasen',
      attr: attr,
      disabled: false,
      required: true,
      options: examPhases,
      show: showExamPhase,
      initialValue: xs => entries.filter(a => xs.some(m => m.id === a.id)),
      dialogInstance: () => examPhaseDialogInstance(attr),
    }
  }

  function firstExaminerInput(): OptionsInput<Identity> {
    return {
      kind: 'options',
      label: 'Erstprüfer*in',
      attr: 'first-examiner',
      disabled: false,
      required: true,
      data: examiner,
      show: showPerson,
      initialValue: metadata && (xs => xs.find(a => a.id === metadata.examiner.first)),
    }
  }

  function secondExaminerInput(): OptionsInput<Identity> {
    return {
      kind: 'options',
      label: 'Zweitprüfer*in',
      attr: 'second-examiner',
      disabled: false,
      required: true,
      data: examiner,
      show: showPerson,
      initialValue: metadata && (xs => xs.find(a => a.id === metadata.examiner.second)),
    }
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
      required: false,
      options: assessmentMethods,
      show: showAssessmentMethodEntry,
      initialValue: xs => entries.filter(a => xs.some(m => m.id === a.method)),
      dialogInstance: () => dialogInstance(attr, kind),
    }
  }

  function examPhaseDialogInstance(attr: string) {
    const columns = [{attr: 'exam-phase', title: 'Prüfungsphase'}]
    const current = currentExamPhases(attr)
    const callback = new ExamPhasesCallback(examPhases, current, columns[0].attr, showExamPhase)
    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      'Prüfungsphasen bearbeiten',
      [
        <OptionsInput<ExamPhase>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: examPhases,
          show: showExamPhase,
        },
      ],
      current,
    )
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

  function showExamPhase(p: ExamPhase) {
    return p.label
  }

  function label(kind: AssessmentMethodKind): string {
    switch (kind) {
      case 'mandatory':
        return optionalLabel('Prüfungsformen für alle Pflicht Studiengänge')
      case 'optional':
        return optionalLabel('Prüfungsformen für alle als WPF belegbare Studiengänge')
    }
  }

  return {
    'assessment-methods': [{input: assessmentMethodsMandatoryInput() as FormInput<unknown, unknown>}],
    'assessment-methods-optional': [{input: assessmentMethodsOptionalInput() as FormInput<unknown, unknown>}],
    'exam-phases': [{input: examPhasesInput() as FormInput<unknown, unknown>}],
    'first-examiner': [{input: firstExaminerInput() as FormInput<unknown, unknown>}],
    'second-examiner': [{input: secondExaminerInput() as FormInput<unknown, unknown>}],
  }
}
