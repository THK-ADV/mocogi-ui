import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { arrayToObject } from '../../ops/array-to-object'
import { OptionsInput, OptionsInputComponent } from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import { validMandatoryCommaSeparatedNumber, validMandatoryObject, validOptionalCommaSeparatedNumber } from './callback-validation'
import { POMandatory, POPreview } from '../../types/pos'
import { showRecommendedSemester } from '../../ops/show.instances'

export class PoMandatoryCallback implements MultipleEditDialogComponentCallback<POMandatory, POPreview> {
  readonly all: { [id: string]: POPreview } = {}
  readonly selected: { [id: string]: POMandatory } = {}

  constructor(all: Readonly<POPreview[]>, selected: Readonly<POMandatory[]>) {
    this.all = arrayToObject(all, a => a.id)
    this.selected = arrayToObject(selected, a => a.po)
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

  addOptionToOptionsInputComponent(option: POMandatory, components: QueryList<OptionsInputComponent<unknown>>): void {
    const po = this.lookup(option.po)
    const component = components.find(a => a.input.attr === 'po')
    po && component && component.addOption(po)
    component?.reset()
  }

  removeOptionFromOptionsInputComponent(option: POMandatory, components: QueryList<OptionsInputComponent<unknown>>): void {
    const po = this.lookup(option.po)
    const component = components.find(a => a.input.attr === 'po')
    po && component && component.removeOption(po)
    component?.reset()
  }

  tableContent(tableEntry: POMandatory, attr: string): string {
    switch (attr) {
      case 'po':
        return this.lookupLabel(tableEntry.po)
      case 'recommended-semester':
        return showRecommendedSemester(tableEntry.recommendedSemester)
      default:
        return '???'
    }
  }

  tableEntryAlreadyExists(controls: { [key: string]: FormControl }): (e: POMandatory) => boolean {
    const po = this.getPOValue(controls)
    return (entry) => entry.po === po.id
  }

  toTableEntry(controls: { [key: string]: FormControl }): POMandatory {
    const po = this.getPOValue(controls)
    const recommendedSemester = this.getRecommendedSemesterValue(controls)

    return {
      po: po.id,
      recommendedSemester: recommendedSemester
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onValidate(_controls: { [key: string]: FormControl }): void { return }

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    return !this.validPO(controls['po'].value) ||
      !this.validRecommendedSemester(controls['recommended-semester'].value) ||
      !this.validRecommendedSemesterPartTime(controls['recommended-semester-part-time'].value)
  }

  private validPO = (value: unknown) =>
    validMandatoryObject(value)

  private validRecommendedSemester = (value: unknown) =>
    validMandatoryCommaSeparatedNumber(value)

  private validRecommendedSemesterPartTime = (value: unknown) =>
    validOptionalCommaSeparatedNumber(value)

  private getRecommendedSemesterValue = (controls: { [p: string]: FormControl }) =>
    (controls['recommended-semester'].value as string)
      .split(',')
      .map(a => Number(a))

  private getPOValue = (controls: { [p: string]: FormControl }) =>
    controls['po'].value as POPreview

  private lookup = (id: string): POPreview | undefined =>
    this.all[id]

  private lookupLabel = (id: string): string =>
    this.lookup(id)?.label ?? '???'
}
