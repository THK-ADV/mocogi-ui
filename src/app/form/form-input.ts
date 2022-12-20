import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import { NumberInput, TextInput } from './plain-input/plain-input.component'
import { OptionsInput } from './options-input/options-input.component'
import { MultipleOptionsInput } from './multiple-options-input/multiple-options-input.component'

export interface FormInputLike {
  kind: string
  label: string
  attr: string
  disabled: boolean
  required: boolean
}

export type FormInput =
  TextInput |
  NumberInput |
  OptionsInput<any> |
  MultipleOptionsInput<any>
// BooleanInput |
// URLInput |
// DateInput

export const combine = (
  fs: Array<(i: FormInput) => FormControl | undefined>
): (i: FormInput) => FormControl | undefined =>
  i => {
    for (const f of fs) {
      const res = f(i)
      if (res) {
        return res
      }
    }
    return undefined
  }

const invalidOptionKey = 'invalidObject'

export const isJSON = (value: any): boolean =>
  typeof value !== 'string'

const error = () => ({[invalidOptionKey]: 'Invalide Auswahl'})

export const mandatoryOptionsValidator = (): ValidatorFn =>
  (ctl: AbstractControl): ValidationErrors | null =>
    !isJSON(ctl.value) || ctl.value === null || ctl.value === ''
      ? error()
      : null

export const optionalOptionsValidator = (): ValidatorFn =>
  (ctl: AbstractControl): ValidationErrors | null =>
    ctl.value === '' || isJSON(ctl.value)
      ? null
      : error()

export const optionsError = (formControl: FormControl): string | undefined =>
  formControl.hasError(invalidOptionKey)
    ? formControl.getError(invalidOptionKey)
    : undefined

export const requiredError = (formControl: FormControl, input: FormInputLike): string | undefined =>
  formControl.hasError('required')
    ? `${input.label} erforderlich`
    : undefined
