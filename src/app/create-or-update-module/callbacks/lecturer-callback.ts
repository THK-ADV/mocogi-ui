import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { Person } from '../../http/http.service'
import { arrayToObject } from '../../types/array-to-object'
import { OptionsInput, OptionsInputComponent } from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import { showPerson } from '../inputs/responsibility-input'

export class LecturerCallback implements MultipleEditDialogComponentCallback<Person> {
  readonly all: { [id: string]: Person } = {}
  readonly selected: { [id: string]: Person } = {}

  constructor(all: Readonly<Person[]>, selected: Readonly<Person[]>) {
    this.all = arrayToObject(all, a => a.id)
    this.selected = arrayToObject(selected, a => a.id)
  }

  filterInitialOptionsForComponent(optionsInput: OptionsInput<any>): any[] {
    const data = optionsInput.data as Person[]
    if (optionsInput.attr === 'person') {
      return data.filter(d => !this.selected[d.id])
    } else {
      return data
    }
  }

  addOptionToOptionsInputComponent(option: Person, components: QueryList<OptionsInputComponent<any>>): void {
    const person = this.lookup(option.id)
    const component = components.find(a => a.input.attr === 'person')
    person && component && component.addOption(person)
  }

  removeOptionFromOptionsInputComponent(option: Person, components: QueryList<OptionsInputComponent<any>>): void {
    const person = this.lookup(option.id)
    const component = components.find(a => a.input.attr === 'person')
    person && component && component.removeOption(person)
  }

  tableContent(tableEntry: Person, attr: string): string {
    switch (attr) {
      case 'person':
        return showPerson(tableEntry)
      default:
        return '???'
    }
  }

  tableEntryAlreadyExists(controls: { [key: string]: FormControl }): (e: Person) => boolean {
    const person = this.getPersonValue(controls)
    return (entry) => entry.id === person.id
  }

  toTableEntry(controls: { [key: string]: FormControl }): Person {
    return this.getPersonValue(controls)
  }

  onValidate(controls: { [key: string]: FormControl }): void {
    console.log('person', this.validPerson(controls['person'].value))
  }

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    return !this.validPerson(controls['person'].value)
  }

  private validPerson = (value: any) =>
    value !== undefined &&
    value !== '' &&
    value !== null

  private getPersonValue = (controls: { [p: string]: FormControl }) =>
    controls['person'].value as Person

  private lookup = (id: string): Person | undefined =>
    this.all[id]
}
