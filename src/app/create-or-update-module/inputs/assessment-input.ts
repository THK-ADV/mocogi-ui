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
import { MetadataLike } from '../../types/metadata'
import { ExamPhasesCallback } from '../callbacks/exam-phases-callback'

export type AssessmentMethodKind = 'mandatory' | 'optional'

export function assessmentInput(
  dialog: MatDialog,
  assessmentMethods: AssessmentMethod[],
  currentEntries: (
    attr: string,
    kind: AssessmentMethodKind,
  ) => AssessmentMethodEntry[],
  examPhases: ExamPhase[],
  currentExamPhases: (attr: string) => ExamPhase[],
  identities: Identity[],
  metadata: MetadataLike | undefined,
): Rows<unknown, unknown> {
  const examiner = identities.filter((a) => a.kind !== 'group')

  function assignmentMethodLabel(kind: AssessmentMethodKind): string {
    switch (kind) {
      case 'mandatory':
        return optionalLabel(
          $localize`Prüfungsformen für alle Pflicht Studiengänge`,
        )
      case 'optional':
        return optionalLabel(
          $localize`Prüfungsformen für alle als WPF belegbare Studiengänge`,
        )
    }
  }

  // TODO maybe change everything to objects
  function showAssessmentMethodEntry(e: AssessmentMethodEntry): string {
    return (
      mapOpt(
        assessmentMethods.find((a) => a.id === e.method),
        showLabel,
      ) ?? '???'
    )
  }

  function dialogInstance(attr: string, kind: AssessmentMethodKind) {
    const entries = currentEntries(attr, kind)
    const callback = new AssessmentMethodCallback(assessmentMethods, entries)
    const columns = [
      { attr: 'method', title: $localize`Prüfungsform` },
      { attr: 'percentage', title: $localize`Prozentualer Anteil` },
      { attr: 'precondition', title: $localize`Vorbedingungen` },
    ]

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      $localize`Prüfungsformen bearbeiten`,
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

  function go(
    kind: AssessmentMethodKind,
  ): ReadOnlyInput<AssessmentMethod, AssessmentMethodEntry> {
    const attr = `assessment-methods-${kind}`
    const entries = currentEntries(attr, kind)
    return {
      kind: 'read-only',
      label: assignmentMethodLabel(kind),
      attr: attr,
      disabled: false,
      required: false,
      options: assessmentMethods,
      show: showAssessmentMethodEntry,
      initialValue: (xs) =>
        entries.filter((a) => xs.some((m) => m.id === a.method)),
      dialogInstance: () => dialogInstance(attr, kind),
    }
  }

  function assessmentMethodsMandatoryInput(): ReadOnlyInput<
    AssessmentMethod,
    AssessmentMethodEntry
  > {
    return go('mandatory')
  }

  function assessmentMethodsOptionalInput(): ReadOnlyInput<
    AssessmentMethod,
    AssessmentMethodEntry
  > {
    return go('optional')
  }

  function showExamPhase(p: ExamPhase) {
    return p.label
  }

  function examPhaseDialogInstance(attr: string) {
    const columns = [{ attr: 'exam-phase', title: $localize`Prüfungsphase` }]
    const current = currentExamPhases(attr)
    const callback = new ExamPhasesCallback(
      examPhases,
      current,
      columns[0].attr,
      showExamPhase,
    )
    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      $localize`Prüfungsphasen bearbeiten`,
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

  function examPhasesInput(): ReadOnlyInput<ExamPhase, ExamPhase> {
    const attr = 'exam-phases'
    const entries = currentExamPhases(attr)
    return {
      kind: 'read-only',
      label: $localize`Prüfungsphasen`,
      attr: attr,
      disabled: false,
      required: true,
      options: examPhases,
      show: showExamPhase,
      initialValue: (xs) =>
        entries.filter((a) => xs.some((m) => m.id === a.id)),
      dialogInstance: () => examPhaseDialogInstance(attr),
    }
  }

  function firstExaminerInput(): OptionsInput<Identity> {
    return {
      kind: 'options',
      label: $localize`Erstprüfer*in`,
      attr: 'first-examiner',
      disabled: false,
      required: true,
      data: examiner,
      show: showPerson,
      initialValue:
        metadata && ((xs) => xs.find((a) => a.id === metadata.examiner.first)),
    }
  }

  function secondExaminerInput(): OptionsInput<Identity> {
    return {
      kind: 'options',
      label: $localize`Zweitprüfer*in`,
      attr: 'second-examiner',
      disabled: false,
      required: true,
      data: examiner,
      show: showPerson,
      initialValue:
        metadata && ((xs) => xs.find((a) => a.id === metadata.examiner.second)),
    }
  }

  return {
    'assessment-methods': [
      {
        input: assessmentMethodsMandatoryInput() as FormInput<unknown, unknown>,
      },
    ],
    'assessment-methods-optional': [
      {
        input: assessmentMethodsOptionalInput() as FormInput<unknown, unknown>,
      },
    ],
    'exam-phases': [
      { input: examPhasesInput() as FormInput<unknown, unknown> },
    ],
    'first-examiner': [
      { input: firstExaminerInput() as FormInput<unknown, unknown> },
    ],
    'second-examiner': [
      { input: secondExaminerInput() as FormInput<unknown, unknown> },
    ],
  }
}
