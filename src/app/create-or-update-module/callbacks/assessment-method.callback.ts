import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { arrayToObject } from '../../ops/array-to-object'
import {
  OptionsInput,
  OptionsInputComponent,
} from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  validMandatoryObject,
  validOptionalNumber,
  validOptionalObject,
} from './callback-validation'
import { mapOpt } from '../../ops/undefined-ops'
import { AssessmentMethodEntry } from '../../types/assessment-methods'
import { AssessmentMethod } from '../../types/core/assessment-method'
import { showLabel } from '../../ops/show.instances'

export class AssessmentMethodCallback
  implements
    MultipleEditDialogComponentCallback<
      AssessmentMethodEntry,
      AssessmentMethod
    >
{
  readonly all: { [id: string]: AssessmentMethod } = {}
  readonly selected: { [id: string]: AssessmentMethodEntry } = {}

  constructor(
    all: Readonly<AssessmentMethod[]>,
    selected: Readonly<AssessmentMethodEntry[]>,
  ) {
    this.all = arrayToObject(all, (a) => a.id)
    this.selected = arrayToObject(selected, (a) => a.method)
  }

  filterInitialOptionsForComponent(
    optionsInput: OptionsInput<AssessmentMethod>,
  ): AssessmentMethod[] {
    const data = optionsInput.data
    if (!Array.isArray(data)) {
      return []
    }
    if (optionsInput.attr === 'method') {
      return data.filter((d) => !this.selected[d.id])
    } else {
      return data
    }
  }

  addOptionToOptionsInputComponent(
    option: AssessmentMethodEntry,
    components: QueryList<OptionsInputComponent<unknown>>,
  ): void {
    const method = this.lookup(option.method)
    const component = components.find((a) => a.input.attr === 'method')
    method && component && component.addOption(method)
    component?.reset()
  }

  removeOptionFromOptionsInputComponent(
    option: AssessmentMethodEntry,
    components: QueryList<OptionsInputComponent<unknown>>,
  ): void {
    const method = this.lookup(option.method)
    const component = components.find((a) => a.input.attr === 'method')
    method && component && component.removeOption(method)
    component?.reset()
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

  tableEntryAlreadyExists(controls: {
    [key: string]: FormControl
  }): (e: AssessmentMethodEntry) => boolean {
    const assessmentMethod = this.getAssessmentMethodValue(controls)
    return (entry) => entry.method === assessmentMethod.id
  }

  toTableEntry(controls: {
    [key: string]: FormControl
  }): AssessmentMethodEntry {
    const assessmentMethod = this.getAssessmentMethodValue(controls)
    const percentage = this.getPercentageValue(controls)
    const precondition = this.getPreconditionValue(controls)

    return {
      method: assessmentMethod.id,
      percentage: percentage,
      precondition: precondition ? [precondition.id] : [],
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onValidate(_controls: { [key: string]: FormControl }): void {
    return
  }

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    return (
      !this.validAssessmentMethod(controls['method'].value) ||
      !this.validPercentage(controls['percentage'].value) ||
      !this.validPrecondition(controls['precondition'].value)
    )
  }

  private validAssessmentMethod = (value: unknown) =>
    validMandatoryObject(value)

  private validPercentage = (value: unknown) => validOptionalNumber(value)

  private validPrecondition = (value: unknown) => validOptionalObject(value)

  private getPreconditionValue = (controls: { [p: string]: FormControl }) =>
    controls['precondition'].value as AssessmentMethod | undefined

  private getPercentageValue = (controls: { [p: string]: FormControl }) =>
    controls['percentage'].value as number | undefined

  private getAssessmentMethodValue = (controls: { [p: string]: FormControl }) =>
    controls['method'].value as AssessmentMethod

  private lookup = (method: string): AssessmentMethod | undefined =>
    this.all[method]

  private lookupLabel = (method: string): string =>
    mapOpt(this.lookup(method), showLabel) ?? '???'
}
