import { Component, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { formControlForInput, FormInput } from '../form-input'
import { NumberInput, TextInput } from '../plain-input/plain-input.component'
import { OptionsInput } from '../options-input/options-input.component'
import { MultipleOptionsInput } from '../multiple-options-input/multiple-options-input.component'
import { ReadOnlyInput } from '../read-only-input/read-only-input.component'
import { BooleanInput } from '../boolean-input/boolean-input.component'

export interface EditModulePayload {
  objectName: string
  editType: EditType
  inputs: {
    header: string,
    value: FormInput[]
  }[]
}

type EditType = 'create' | 'update'

@Component({
  selector: 'sched-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.css']
})
export class EditModuleComponent implements OnInit {

  @Input() payload!: EditModulePayload
  @Input() onCancel?: () => void
  @Input() onSubmit?: (any: any) => void

  title = ''
  buttonTitle = ''
  formGroup = new FormGroup({})

  ngOnInit() {
    this.buttonTitle = this.payload.editType === 'create' ? 'Erstellen' : 'Aktualisieren'
    this.title = `${this.payload.objectName} ${this.buttonTitle.toLowerCase()}`
    this.payload.inputs.forEach(is => is.value.forEach(i => {
      const fc = formControlForInput()(i)
      if (fc) {
        if (i.disabled) {
          fc.disable()
        }
        this.formGroup.addControl(i.attr, fc)
      }
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

  asTextInput = (i: FormInput): TextInput | NumberInput =>
    i as TextInput || i as NumberInput

  asOptions = (i: FormInput) =>
    i as OptionsInput<unknown>

  asMultipleOptions = (i: FormInput) =>
    i as MultipleOptionsInput<unknown>

  asReadOnly = (i: FormInput) =>
    i as ReadOnlyInput<unknown, unknown>

  asBoolean = (i: FormInput) =>
    i as BooleanInput

  formControl = (attr: string) =>
    this.formGroup.get(attr) as FormControl
}
