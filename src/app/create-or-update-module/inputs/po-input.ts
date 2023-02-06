import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { MatDialog } from '@angular/material/dialog'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { optionalLabel, requiredLabel } from './inputs'
import { PoMandatoryCallback } from '../callbacks/po-mandatory-callback'
import { PoOptionalCallback } from '../callbacks/po-optional-callback'
import { POMandatory, POOptional, POPreview } from '../../types/pos'
import { Module } from '../../types/module'
import { OptionsInput } from '../../form/options-input/options-input.component'
import { FormInput } from '../../form/form-input'

export function poInput(
  dialog: MatDialog,
  allPOs: POPreview[],
  genericModules: Module[],
  currentMandatoryEntries: (attr: string) => POMandatory[],
  currentOptionalEntries: (attr: string) => POOptional[],
) {

  const dialogTitle = 'Zugehörigkeit zu Studiengängen bearbeiten'
  const poColumn = {attr: 'po', title: 'Studiengang'}

  function mandatory(): ReadOnlyInput<POPreview, POMandatory> {
    const attr = 'po-mandatory'
    const entries = currentMandatoryEntries(attr)
    return {
      kind: 'read-only',
      label: 'Verwendung in Studiengängen als Pflicht Modul',
      attr: attr,
      disabled: false,
      required: true,
      options: allPOs,
      show: showPOMandatory,
      initialValue: xs => entries.filter(e => xs.some(x => x.id === e.po)),
      dialogInstance: () => mandatoryDialogInstance(attr)
    }
  }

  function optional(): ReadOnlyInput<POPreview, POOptional> {
    const attr = 'po-optional'
    const entries = currentOptionalEntries(attr)
    return {
      kind: 'read-only',
      label: optionalLabel('Verwendung in Studiengängen als WPF'),
      attr: attr,
      disabled: false,
      required: false,
      options: allPOs,
      show: showPOOptional,
      initialValue: xs => entries.filter(e => xs.some(x => x.id === e.po)),
      dialogInstance: () => optionalDialogInstance(attr)
    }
  }

  function poPreviewOptionsInput(): OptionsInput<POPreview> {
    return {
      kind: 'options',
      label: requiredLabel(poColumn.title),
      attr: poColumn.attr,
      disabled: false,
      required: false,
      data: allPOs,
      show: (a) => a.label,
    }
  }

  function mandatoryDialogInstance(attr: string) {
    const entries = currentMandatoryEntries(attr)
    const callback = new PoMandatoryCallback(allPOs, entries)
    const columns = [
      poColumn,
      {attr: 'recommended-semester', title: 'Empfohlene Studiensemester (kommasepariert)'},
      {attr: 'recommended-semester-part-time', title: 'Empfohlene Studiensemester für Teilzeit Studium (kommasepariert)'},
    ]
    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      dialogTitle,
      [
        poPreviewOptionsInput(),
        {
          kind: 'text',
          label: requiredLabel(columns[1].title),
          attr: columns[1].attr,
          disabled: false,
          required: false
        },
        {
          kind: 'text',
          label: optionalLabel(columns[2].title),
          attr: columns[2].attr,
          disabled: false,
          required: false
        },
      ],
      entries
    )
  }

  function optionalDialogInstance(attr: string) {
    const entries = currentOptionalEntries(attr)
    const callback = new PoOptionalCallback(allPOs, entries, genericModules)
    const columns = [
      poColumn,
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
        poPreviewOptionsInput(),
        <OptionsInput<Module>>{
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
          label: optionalLabel(columns[3].title),
          attr: columns[3].attr,
          disabled: false,
          required: false
        },
      ],
      entries
    )
  }

  function showPOMandatory(po: POMandatory): string {
    return allPOs.find(p => p.id === po.po)?.abbrev ?? '???'
  }

  function showPOOptional(po: POOptional): string {
    return allPOs.find(p => p.id === po.po)?.abbrev ?? '???'
  }

  return <FormInput<unknown, unknown>[]>[
    mandatory(),
    optional()
  ]
}
