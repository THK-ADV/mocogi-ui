import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { arrayToObject } from '../../ops/array-to-object'
import { OptionsInput, OptionsInputComponent } from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import { validMandatoryObject } from './callback-validation'

export class SingleEntryCallback<A> implements MultipleEditDialogComponentCallback<A> {
  readonly id: (a: A) => string
  readonly show: (a: A) => string
  readonly attr: string
  readonly all: { [id: string]: A } = {}
  readonly selected: { [id: string]: A } = {}

  constructor(all: Readonly<A[]>, selected: Readonly<A[]>, attr: string, id: (a: A) => string, show: (a: A) => string) {
    this.id = id
    this.show = show
    this.attr = attr
    this.all = arrayToObject(all, id)
    this.selected = arrayToObject(selected, id)
  }

  filterInitialOptionsForComponent(optionsInput: OptionsInput<any>): any[] {
    const data = optionsInput.data as A[]
    if (optionsInput.attr === this.attr) {
      return data.filter(a => !this.selected[this.id(a)])
    } else {
      return data
    }
  }

  addOptionToOptionsInputComponent(option: A, components: QueryList<OptionsInputComponent<any>>): void {
    const a = this.lookup(this.id(option))
    const component = components.find(a => a.input.attr === this.attr)
    a && component && component.addOption(a)
    component?.reset()
  }

  removeOptionFromOptionsInputComponent(option: A, components: QueryList<OptionsInputComponent<any>>): void {
    const a = this.lookup(this.id(option))
    const component = components.find(a => a.input.attr === this.attr)
    a && component && component.removeOption(a)
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

  tableEntryAlreadyExists(controls: { [key: string]: FormControl }): (e: A) => boolean {
    const a = this.getAValue(controls)
    return (entry) => this.id(entry) === this.id(a)
  }

  toTableEntry(controls: { [key: string]: FormControl }): A {
    return this.getAValue(controls)
  }

  onValidate(controls: { [key: string]: FormControl }): void {
    console.log(this.attr, this.validA(controls[this.attr].value))
  }

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    return !this.validA(controls[this.attr].value)
  }

  private validA = (value: any) =>
    validMandatoryObject(value)

  private getAValue = (controls: { [p: string]: FormControl }) =>
    controls[this.attr].value as A

  private lookup = (id: string): A | undefined =>
    this.all[id]
}
