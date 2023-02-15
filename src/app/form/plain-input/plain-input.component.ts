import { Component, Input } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { FormInputLike, requiredError } from '../form-input'

export interface TextInput extends FormInputLike {
  initialValue?: string
  kind: 'text'
}

export interface TextAreaInput extends FormInputLike {
  initialValue?: string
  kind: 'text-area'
}

export interface NumberInput extends FormInputLike {
  initialValue?: number
  min?: number
  max?: number
  kind: 'number'
}

export const formControlForTextInput = (i: TextInput | TextAreaInput): FormControl =>
  new FormControl(
    {value: i.initialValue, disabled: i.disabled},
    i.required ? Validators.required : undefined
  )

export const formControlForNumberInput = (i: NumberInput): FormControl<number | undefined | null> => {
  const validators = []
  if (i.required) {
    validators.push(Validators.required)
  }
  if (i.min) {
    validators.push(Validators.min(i.min))
  }
  if (i.max) {
    validators.push(Validators.max(i.max))
  }
  return new FormControl({value: i.initialValue, disabled: i.disabled}, validators)
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
  @Input() input!: TextInput | NumberInput | TextAreaInput

  getErrorMessage = () =>
    requiredError(this.formControl, this.input)
    ?? minError(this.formControl)
    ?? maxError(this.formControl)

  isTextArea = (): boolean =>
    this.input.kind === 'text-area'
}
