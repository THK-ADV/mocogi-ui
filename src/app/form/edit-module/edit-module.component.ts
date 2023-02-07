import { Component, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { asMultipleOptionsInput, asOptionsInput, asReadOnlyInput, formControlForInput, FormInput } from '../form-input'
import { NumberInput, TextInput } from '../plain-input/plain-input.component'
import { BooleanInput } from '../boolean-input/boolean-input.component'
import { throwError } from '../../types/error'

export interface EditModulePayload<A, B> {
  objectName: string
  editType: EditType
  inputs: {
    header: string,
    value: FormInput<A, B>[]
  }[]
}

type EditType = 'create' | 'update'

@Component({
  selector: 'sched-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.css']
})
export class EditModuleComponent<A, B> implements OnInit {

  @Input() payload!: EditModulePayload<A, B>
  @Input() onCancel?: () => void
  @Input() onSubmit?: (value: unknown) => void

  title = ''
  buttonTitle = ''
  formGroup = new FormGroup({})

  ngOnInit() {
    this.buttonTitle = this.payload.editType === 'create' ? 'Erstellen' : 'Aktualisieren'
    this.title = `${this.payload.objectName} ${this.buttonTitle.toLowerCase()}`
    this.payload.inputs.forEach(is => is.value.forEach(i => {
      const fc = formControlForInput(i)
      if (i.disabled) {
        fc.disable()
      }
      this.formGroup.addControl(i.attr, fc)
    }))
  }

  submit = () => {
    if (!this.formGroup.valid) {
      return
    }
    this.onSubmit?.(this.formGroup.value)
  }

  cancel = () =>
    this.onCancel?.()

  validate = () => {
    console.log('is valid: ', this.formGroup.valid)
    for (const attr in this.formGroup.controls) {
      const ctrl = this.formGroup.get(attr)
      ctrl?.errors && console.log(attr, ctrl?.value, ctrl?.errors)
    }
  }

  asTextInput = (i: FormInput<A, B>): TextInput | NumberInput =>
    i as TextInput || i as NumberInput

  asOptions = (i: FormInput<A, B>) =>
    asOptionsInput(i) ?? throwError(`expected form input to be options input, but was ${i.kind}`)

  asMultipleOptions = (i: FormInput<A, B>) =>
    asMultipleOptionsInput(i) ?? throwError(`expected form input to be multiple options input, but was ${i.kind}`)

  asReadOnly = (i: FormInput<A, B>) =>
    asReadOnlyInput(i) ?? throwError(`expected form input to be read only input, but was ${i.kind}`)

  asBoolean = (i: FormInput<A, B>) =>
    i as BooleanInput

  formControl = (attr: string) =>
    this.formGroup.get(attr) as FormControl
}
