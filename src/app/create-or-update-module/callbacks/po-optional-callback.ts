import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { arrayToObject } from '../../ops/array-to-object'
import { OptionsInput, OptionsInputComponent } from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import { validMandatoryBoolean, validMandatoryCommaSeparatedNumber, validMandatoryObject } from './callback-validation'
import { POOptional, POPreview } from '../../types/pos'
import { Module } from '../../types/module'

export class PoOptionalCallback implements MultipleEditDialogComponentCallback<POOptional, POPreview> {
  readonly all: { [id: string]: POPreview } = {}
  readonly selected: { [id: string]: POOptional } = {}
  readonly genericModules: { [id: string]: Module } = {}

  constructor(
    all: Readonly<POPreview[]>,
    selected: Readonly<POOptional[]>,
    genericModules: Readonly<Module>[]
  ) {
    this.all = arrayToObject(all, a => a.id)
    this.selected = arrayToObject(selected, a => a.po)
    this.genericModules = arrayToObject(genericModules, a => a.id)
  }

  filterInitialOptionsForComponent(optionsInput: OptionsInput<POPreview>): POPreview[] {
    const data = optionsInput.data
    if (!Array.isArray(data)) {
      return []
    }
    if (optionsInput.attr === 'po') {
      return data.filter(d => !this.selected[d.id])
    } else {
      return data
    }
  }

  addOptionToOptionsInputComponent(option: POOptional, components: QueryList<OptionsInputComponent<unknown>>): void {
    const po = this.lookup(option.po)
    const component = components.find(a => a.input.attr === 'po')
    po && component && component.addOption(po)
    component?.reset()
  }

  removeOptionFromOptionsInputComponent(option: POOptional, components: QueryList<OptionsInputComponent<unknown>>): void {
    const po = this.lookup(option.po)
    const component = components.find(a => a.input.attr === 'po')
    po && component && component.removeOption(po)
    component?.reset()
  }

  tableContent(tableEntry: POOptional, attr: string): string {
    switch (attr) {
      case 'po':
        return this.lookupLabel(tableEntry.po)
      case 'instance-of':
        return this.genericModules[tableEntry.instanceOf].title
      case 'part-of-catalog':
        return tableEntry.partOfCatalog ? 'Ja' : 'Nein'
      case 'recommended-semester':
        return tableEntry.recommendedSemester.join(', ')
      default:
        return '???'
    }
  }

  tableEntryAlreadyExists(controls: { [key: string]: FormControl }): (e: POOptional) => boolean {
    const po = this.getPOValue(controls)
    return (entry) => entry.po === po.id
  }

  toTableEntry(controls: { [key: string]: FormControl }): POOptional {
    const po = this.getPOValue(controls)
    const instanceOf = this.getInstanceOfValue(controls)
    const partOfCatalog = this.getPartOfCatalogValue(controls)
    const recommendedSemester = this.getRecommendedSemesterValue(controls)

    return {
      po: po.id,
      instanceOf: instanceOf.id,
      partOfCatalog: partOfCatalog,
      recommendedSemester: recommendedSemester,
    }
  }

  onValidate(controls: { [key: string]: FormControl }): void {
    console.log('po', controls['po'].value, this.validPO(controls['po'].value))
    console.log('instance-of', controls['instance-of'].value, this.validInstanceOf(controls['instance-of'].value))
    console.log('part-of-catalog', controls['part-of-catalog'].value, this.validPartOfCatalog(controls['part-of-catalog'].value))
    console.log('recommended-semester', controls['recommended-semester'].value, this.validRecommendedSemester(controls['recommended-semester'].value))
  }

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    return !this.validPO(controls['po'].value) ||
      !this.validInstanceOf(controls['instance-of'].value) ||
      !this.validPartOfCatalog(controls['part-of-catalog'].value) ||
      !this.validRecommendedSemester(controls['recommended-semester'].value)
  }

  private validPO = (value: unknown) =>
    validMandatoryObject(value)

  private validInstanceOf = (value: unknown) =>
    validMandatoryObject(value)

  private validPartOfCatalog = (value: unknown) =>
    validMandatoryBoolean(value)

  private validRecommendedSemester = (value: unknown) =>
    validMandatoryCommaSeparatedNumber(value)

  private getRecommendedSemesterValue = (controls: { [p: string]: FormControl }) =>
    (controls['recommended-semester'].value as string)
      .split(',')
      .map(a => Number(a))

  private getPOValue = (controls: { [p: string]: FormControl }) =>
    controls['po'].value as POPreview

  private getInstanceOfValue = (controls: { [p: string]: FormControl }) =>
    controls['instance-of'].value as Module

  private getPartOfCatalogValue = (controls: { [p: string]: FormControl }) =>
    controls['part-of-catalog'].value as boolean

  private lookup = (id: string): POPreview | undefined =>
    this.all[id]

  private lookupLabel = (id: string): string =>
    this.lookup(id)?.label ?? '???'
}
