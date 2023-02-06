import { FormInput } from '../../form/form-input'
import { ReadOnlyInput } from '../../form/read-only-input/read-only-input.component'
import { MatDialog } from '@angular/material/dialog'
import { MultipleEditDialogComponent } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { optionalLabel, requiredLabel } from './inputs'
import { PoMandatoryCallback } from '../callbacks/po-mandatory-callback'
import { PoOptionalCallback } from '../callbacks/po-optional-callback'
import { POMandatory, POOptional, POPreview } from '../../types/pos'
import { Module } from '../../types/module'

export function poInput(
  dialog: MatDialog,
  allPOs: POPreview[],
  genericModules: Module[],
  currentMandatoryEntries: (attr: string) => POMandatory[],
  currentOptionalEntries: (attr: string) => POOptional[],
): FormInput[] {

  const dialogTitle = 'Zugehörigkeit zu Studiengängen bearbeiten'

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

  function mandatoryDialogInstance(attr: string) {
    const entries = currentMandatoryEntries(attr)
    const callback = new PoMandatoryCallback(allPOs, entries)
    const columns = [
      {attr: 'po', title: 'Studiengang'},
      {attr: 'recommended-semester', title: 'Empfohlene Studiensemester (kommasepariert)'},
      {attr: 'recommended-semester-part-time', title: 'Empfohlene Studiensemester für Teilzeit Studium (kommasepariert)'},
    ]

    return MultipleEditDialogComponent.instance(
      dialog,
      callback,
      columns,
      dialogTitle,
      [
        {
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: allPOs,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          show: (a) => a.label,
        },
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
      {attr: 'po', title: 'Studiengang'},
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
        {
          kind: 'options',
          label: requiredLabel(columns[0].title),
          attr: columns[0].attr,
          disabled: false,
          required: false,
          data: allPOs,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          show: (a) => a.label,
        },
        {
          kind: 'options',
          label: requiredLabel(columns[1].title),
          attr: columns[1].attr,
          disabled: false,
          required: false,
          data: genericModules,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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

  return [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mandatory(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    optional()
  ]
}
