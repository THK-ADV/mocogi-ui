import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { MatDialog } from '@angular/material/dialog'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { optionalLabel, requiredLabel } from './inputs'
import { PoMandatoryCallback } from '../callbacks/po-mandatory-callback'
import { PoOptionalCallback } from '../callbacks/po-optional-callback'
import { POMandatory, POOptional } from '../../types/pos'
import { ModuleCore } from '../../types/moduleCore'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'
import { Rows } from '../../form/module-form/module-form.component'
import { StudyProgram } from '../../types/module-compendium'
import { showStudyProgram } from '../../ops/show.instances'

export function studyProgramInput(
  dialog: MatDialog,
  studyPrograms: StudyProgram[],
  genericModules: ModuleCore[],
  currentMandatoryEntries: (attr: string) => POMandatory[],
  currentOptionalEntries: (attr: string) => POOptional[],
): Rows<unknown, unknown> {

  const dialogTitle = 'Zugehörigkeit zu Studiengängen bearbeiten'
  const studyProgramColumn = {attr: 'po', title: 'Studiengang'}

  function mandatory(): ReadOnlyInput<StudyProgram, POMandatory> {
    const attr = 'po-mandatory'
    const entries = currentMandatoryEntries(attr)
    return {
      kind: 'read-only',
      label: 'Verwendung in Studiengängen als Pflicht Modul',
      attr: attr,
      disabled: false,
      required: false,
      options: studyPrograms,
      show: showPOMandatory,
      initialValue: sps => entries.filter(({po}) => sps.some(sp => sp.po.id === po)),
      dialogInstance: () => mandatoryDialogInstance(attr),
    }
  }

  function optional(): ReadOnlyInput<StudyProgram, POOptional> {
    const attr = 'po-optional'
    const entries = currentOptionalEntries(attr)
    return {
      kind: 'read-only',
      label: optionalLabel('Verwendung in Studiengängen als WPF'),
      attr: attr,
      disabled: false,
      required: false,
      options: studyPrograms,
      show: showPOOptional,
      initialValue: sps => entries.filter(({po}) => sps.some(sp => sp.po.id === po)),
      dialogInstance: () => optionalDialogInstance(attr),
    }
  }

  function studyProgramOptionsInput(): OptionsInput<StudyProgram> {
    return {
      kind: 'options',
      label: requiredLabel(studyProgramColumn.title),
      attr: studyProgramColumn.attr,
      disabled: false,
      required: false,
      data: studyPrograms,
      show: showStudyProgram,
    }
  }

  function mandatoryDialogInstance(attr: string) {
    const entries = currentMandatoryEntries(attr)
    const callback = new PoMandatoryCallback(studyPrograms, entries)
    const columns = [
      studyProgramColumn,
      {attr: 'recommended-semester', title: 'Empfohlene Studiensemester (kommasepariert)'},
    ]
    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      dialogTitle,
      [
        studyProgramOptionsInput(),
        {
          kind: 'text',
          label: requiredLabel(columns[1].title),
          attr: columns[1].attr,
          disabled: false,
          required: false,
        },
      ],
      entries,
    )
  }

  function optionalDialogInstance(attr: string) {
    const entries = currentOptionalEntries(attr)
    const callback = new PoOptionalCallback(studyPrograms, entries, genericModules)
    const columns = [
      studyProgramColumn,
      {attr: 'instance-of', title: 'Instanz von'},
      {attr: 'part-of-catalog', title: 'Teil des Modulverzeichnisses'},
      {attr: 'recommended-semester', title: 'Empfohlene Studiensemester (kommasepariert)'},
    ]
    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      dialogTitle,
      [
        studyProgramOptionsInput(),
        <OptionsInput<ModuleCore>>{
          kind: 'options',
          label: requiredLabel(columns[1].title),
          attr: columns[1].attr,
          disabled: false,
          required: false,
          data: genericModules,
          show: (a) => a.title,
        },
        {
          kind: 'boolean',
          label: requiredLabel(columns[2].title),
          attr: columns[2].attr,
          disabled: false,
          required: false,
        },
        {
          kind: 'text',
          label: requiredLabel(columns[3].title),
          attr: columns[3].attr,
          disabled: false,
          required: false,
        },
      ],
      entries,
    )
  }

  function showStudyProgram_(po: string): string {
    const sp = studyPrograms.find(sp => sp.po.id === po)
    return sp ? showStudyProgram(sp) : po
  }

  function showPOMandatory({po}: POMandatory): string {
    return showStudyProgram_(po)
  }

  function showPOOptional({po}: POOptional): string {
    return showStudyProgram_(po)
  }

  return {
    'mandatory-po': [{input: mandatory() as FormInput<unknown, unknown>}],
    'optional-po': [{input: optional() as FormInput<unknown, unknown>}],
  }
}
