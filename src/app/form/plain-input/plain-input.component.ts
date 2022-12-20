import { Component, Input } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { FormInput, FormInputLike, requiredError } from '../form-input'

export interface TextInput extends FormInputLike {
  initialValue?: string
  kind: 'text'
}

export interface NumberInput extends FormInputLike {
  initialValue?: number
  min: number
  max?: number
  kind: 'number'
}

export const formControlForPainInput = (i: FormInput): FormControl | undefined => {
  switch (i.kind) {
    case 'text':
      return new FormControl(
        {value: i.initialValue, disabled: i.disabled},
        i.required ? Validators.required : undefined
      )
    case 'number':
      const validators = [Validators.min(i.min)]
      if (i.required) {
        validators.push(Validators.required)
      }
      if (i.max) {
        validators.push(Validators.max(i.max))
      }
      return new FormControl({value: i.initialValue, disabled: i.disabled}, validators)
    default:
      return undefined
  }
}

export const minError = (formControl: FormControl): string | undefined =>
  formControl.hasError('min')
    ? `Minimum von ${formControl.getError('min').min} erforderlich`
    : undefined

export const maxError = (formControl: FormControl): string | undefined =>
  formControl.hasError('max')
    ? `Maximum von ${formControl.getError('max').max} erforderlich`
    : undefined

@Component({
  selector: 'sched-plain-input',
  templateUrl: './plain-input.component.html',
  styleUrls: ['./plain-input.component.css']
})
export class PlainInputComponent {
  @Input() formControl!: FormControl
  @Input() input!: TextInput | NumberInput

  getErrorMessage = () =>
    requiredError(this.formControl, this.input)
    ?? minError(this.formControl)
    ?? maxError(this.formControl)
}
