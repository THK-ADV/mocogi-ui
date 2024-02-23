import { TextAreaInput } from '../../form/plain-input/plain-input.component'
import { optionalLabel, requiredLabel } from './inputs'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { MatDialog } from '@angular/material/dialog'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { ModuleCallback } from '../callbacks/module-callback'
import { PrerequisitesStudyProgramCallback } from '../callbacks/prerequisites-study-program-callback'
import { ModuleCore } from '../../types/moduleCore'
import { PrerequisitesOutput } from '../../types/prerequisites'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { showModule, showStudyProgram } from '../../ops/show.instances'
import { Rows } from '../../form/module-form/module-form.component'
import { StudyProgram } from '../../types/module-compendium'

export type PrerequisitesKind = 'required' | 'recommended'

export function prerequisitesInputs(
  dialog: MatDialog,
  allModules: ModuleCore[],
  currentModules: (attr: string, kind: PrerequisitesKind) => ModuleCore[],
  studyPrograms: StudyProgram[],
  currentStudyProgram: (attr: string, kind: PrerequisitesKind) => StudyProgram[],
  prerequisites?: PrerequisitesOutput,
): Rows<unknown, unknown> {
  function requiredPrerequisitesText(): TextAreaInput {
    return text('required', prerequisites?.required?.text)
  }

  function recommendedPrerequisitesText(): TextAreaInput {
    return text('recommended', prerequisites?.recommended?.text)
  }

  function requiredPrerequisitesModules(): ReadOnlyInput<ModuleCore, ModuleCore> {
    return modules('required')
  }

  function recommendedPrerequisitesModules(): ReadOnlyInput<ModuleCore, ModuleCore> {
    return modules('recommended')
  }

  function requiredPrerequisitesPOs(): ReadOnlyInput<StudyProgram, StudyProgram> {
    return studyProgramsInput('required')
  }

  function recommendedPrerequisitesPOs(): ReadOnlyInput<StudyProgram, StudyProgram> {
    return studyProgramsInput('recommended')
  }

  function text(kind: PrerequisitesKind, initialValue?: string): TextAreaInput {
    return {
      kind: 'text-area',
      label: optionalLabel(`${labelPrefix(kind)} Freitext`),
      attr: `${kind}-prerequisites-text`,
      disabled: false,
      required: false,
      initialValue: initialValue,
    }
  }

  function modules(kind: PrerequisitesKind): ReadOnlyInput<ModuleCore, ModuleCore> {
    const attr = `${kind}-prerequisites-modules`
    const entries = currentModules(attr, kind)
    return {
      kind: 'read-only',
      label: optionalLabel(`${labelPrefix(kind)} Module`),
      attr: attr,
      disabled: false,
      required: false,
      options: allModules,
      show: showModule,
      initialValue: xs => xs.filter(x => entries.some(e => e.id === x.id)),
      dialogInstance: () => moduleDialogInstance(attr, kind),
    }
  }

  function studyProgramsInput(kind: PrerequisitesKind): ReadOnlyInput<StudyProgram, StudyProgram> {
    const attr = `${kind}-prerequisites-po`
    const entries = currentStudyProgram(attr, kind)
    return {
      kind: 'read-only',
      label: optionalLabel(`${labelPrefix(kind)} Studiengänge`),
      attr: attr,
      disabled: false,
      required: false,
      options: studyPrograms,
      show: showStudyProgram,
      initialValue: sps => sps.filter(sp => entries.some(({po}) => po.id === sp.po.id)),
      dialogInstance: () => studyProgramDialogInstance(attr, kind),
    }
  }

  function moduleDialogInstance(attr: string, kind: PrerequisitesKind) {
    const columns = [{attr: 'module', title: 'Modul'}]
    const entries = currentModules(attr, kind)
    const callback = new ModuleCallback(allModules, entries, columns[0].attr, showModule)

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
        },
      ],
      entries,
    )
  }

  function studyProgramDialogInstance(attr: string, kind: PrerequisitesKind) {
    const columns = [{attr: 'po', title: 'Studiengang mit PO'}]
    const entries = currentStudyProgram(attr, kind)
    const callback = new PrerequisitesStudyProgramCallback(studyPrograms, entries, columns[0].attr, showStudyProgram)

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      'Studiengänge bearbeiten',
      [
        <OptionsInput<StudyProgram>>{
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: studyPrograms,
          show: showStudyProgram,
        },
      ],
      entries,
    )
  }

  function labelPrefix(kind: PrerequisitesKind): string {
    switch (kind) {
      case 'required':
        return 'Zwingende Voraussetzungen'
      case 'recommended':
        return 'Empfohlene Voraussetzungen'
    }
  }

  return {
    'required-prerequisites-text': [{input: requiredPrerequisitesText() as FormInput<unknown, unknown>}],
    'required-prerequisites-modules': [{input: requiredPrerequisitesModules() as FormInput<unknown, unknown>}],
    'required-prerequisites-pos': [{input: requiredPrerequisitesPOs() as FormInput<unknown, unknown>}],
    'recommended-prerequisites-text': [{input: recommendedPrerequisitesText() as FormInput<unknown, unknown>}],
    'recommended-prerequisites-modules': [{input: recommendedPrerequisitesModules() as FormInput<unknown, unknown>}],
    'recommended-prerequisites-pos': [{input: recommendedPrerequisitesPOs() as FormInput<unknown, unknown>}],
  }
}
