import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { arrayToObject } from '../../ops/array-to-object'
import {
  OptionsInput,
  OptionsInputComponent,
} from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import { validMandatoryObject } from './callback-validation'

export class SingleEntryCallback<A>
  implements MultipleEditDialogComponentCallback<A, A>
{
  readonly id: (a: A) => string
  readonly show: (a: A) => string
  readonly attr: string
  readonly all: { [id: string]: A } = {}
  readonly selected: { [id: string]: A } = {}

  constructor(
    all: Readonly<A[]>,
    selected: Readonly<A[]>,
    attr: string,
    id: (a: A) => string,
    show: (a: A) => string,
  ) {
    this.id = id
    this.show = show
    this.attr = attr
    this.all = arrayToObject(all, id)
    this.selected = arrayToObject(selected, id)
  }

  filterInitialOptionsForComponent(optionsInput: OptionsInput<A>): A[] {
    const data = optionsInput.data
    if (!Array.isArray(data)) {
      return []
    }
    if (optionsInput.attr === this.attr) {
      return data.filter((a) => !this.selected[this.id(a)])
    }
    return data
  }

  addOptionToOptionsInputComponent(
    option: A,
    components: QueryList<OptionsInputComponent<unknown>>,
  ): void {
    const a = this.lookup(this.id(option))
    const component = components.find((_) => _.input.attr === this.attr)
    if (a && component) {
      component.addOption(a)
    }
    component?.reset()
  }

  removeOptionFromOptionsInputComponent(
    option: A,
    components: QueryList<OptionsInputComponent<unknown>>,
  ): void {
    const a = this.lookup(this.id(option))
    const component = components.find((_) => _.input.attr === this.attr)
    if (a && component) {
      component.removeOption(a)
    }
    component?.reset()
  }

  tableContent(tableEntry: A, attr: string): string {
    switch (attr) {
      case this.attr:
        return this.show(tableEntry)
      default:
        return '???'
    }
  }

  tableEntryAlreadyExists(controls: {
    [key: string]: FormControl
  }): (e: A) => boolean {
    const a = this.getAValue(controls)
    return (entry) => this.id(entry) === this.id(a)
  }

  toTableEntry(controls: { [key: string]: FormControl }): A {
    return this.getAValue(controls)
  }

  onValidate(_controls: { [key: string]: FormControl }): void {}

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    return !this.validA(controls[this.attr].value)
  }

  private validA = (value: unknown) => validMandatoryObject(value)

  private getAValue = (controls: { [p: string]: FormControl }) =>
    controls[this.attr].value as A

  private lookup = (id: string): A | undefined => this.all[id]
}
