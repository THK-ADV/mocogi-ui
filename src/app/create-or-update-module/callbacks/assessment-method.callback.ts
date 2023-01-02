import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { AssessmentMethod, AssessmentMethodEntry } from '../../http/http.service'
import { arrayToObject } from '../../types/array-to-object'
import { OptionsInput, OptionsInputComponent } from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'

export class AssessmentMethodCallback implements MultipleEditDialogComponentCallback<AssessmentMethodEntry> {
  readonly assessmentMethods: { [id: string]: AssessmentMethod } = {}
  readonly entries: { [id: string]: AssessmentMethodEntry } = {}

  constructor(assessmentMethods: Readonly<AssessmentMethod[]>, entries: Readonly<AssessmentMethodEntry[]>) {
    this.assessmentMethods = arrayToObject(assessmentMethods, a => a.abbrev)
    this.entries = arrayToObject(entries, a => a.method)
  }

  filterInitialOptionsForComponent(optionsInput: OptionsInput<any>): any[] {
    const data = optionsInput.data as AssessmentMethod[]
    if (optionsInput.attr === 'method') {
      return data.filter(d => !this.entries[d.abbrev])
    } else {
      return data
    }
  }

  addOptionToOptionsInputComponent(option: AssessmentMethodEntry, components: QueryList<OptionsInputComponent<any>>): void {
    const method = this.lookup(option.method)
    const component = components.find(a => a.input.attr === 'method')
    method && component && component.addOption(method)
  }

  removeOptionFromOptionsInputComponent(option: AssessmentMethodEntry, components: QueryList<OptionsInputComponent<any>>): void {
    const method = this.lookup(option.method)
    const component = components.find(a => a.input.attr === 'method')
    method && component && component.removeOption(method)
  }

  tableContent(tableEntry: AssessmentMethodEntry, attr: string): string {
    switch (attr) {
      case 'method':
        return this.lookupLabel(tableEntry.method)
      case 'percentage':
        return tableEntry.percentage ? `${tableEntry.percentage} %` : ''
      case 'precondition':
        return tableEntry.precondition.map(this.lookupLabel).join(', ')
      default:
        return '???'
    }
  }

  tableEntryAlreadyExists(controls: { [key: string]: FormControl }): (e: AssessmentMethodEntry) => boolean {
    const assessmentMethod = this.getAssessmentMethodValue(controls)
    return (entry) => entry.method === assessmentMethod.abbrev
  }

  toTableEntry(controls: { [key: string]: FormControl }): AssessmentMethodEntry {
    const assessmentMethod = this.getAssessmentMethodValue(controls)
    const percentage = this.getPercentageValue(controls)
    const precondition = this.getPreconditionValue(controls)

    return {
      method: assessmentMethod.abbrev,
      percentage: percentage,
      precondition: precondition ? [precondition.abbrev] : []
    }
  }

  onValidate(controls: { [key: string]: FormControl }): void {
    console.log('method', this.validAssessmentMethod(controls['method'].value))
    console.log('percentage', this.validPercentage(controls['percentage'].value))
    console.log('precondition', this.validPrecondition(controls['precondition'].value))
  }

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    return !this.validAssessmentMethod(controls['method'].value) ||
      !this.validPercentage(controls['percentage'].value) ||
      !this.validPrecondition(controls['precondition'].value)
  }

  private validAssessmentMethod = (value: any) =>
    value !== undefined &&
    value !== '' &&
    value !== null

  private validPercentage = (value: any) =>
    value === undefined ||
    (typeof value === 'string' && !isNaN(Number(value)))

  private validPrecondition = (value: any) =>
    value === undefined || typeof value === 'object' || value === ''

  private getPreconditionValue = (controls: { [p: string]: FormControl }) =>
    controls['precondition'].value as AssessmentMethod | undefined

  private getPercentageValue = (controls: { [p: string]: FormControl }) =>
    controls['percentage'].value as number | undefined

  private getAssessmentMethodValue = (controls: { [p: string]: FormControl }) =>
    controls['method'].value as AssessmentMethod

  private lookup = (method: string): AssessmentMethod | undefined =>
    this.assessmentMethods[method]

  private lookupLabel = (method: string): string =>
    this.lookup(method)?.deLabel ?? '???'
}
