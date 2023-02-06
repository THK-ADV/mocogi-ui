import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import { formControlForPainInput, NumberInput, TextAreaInput, TextInput } from './plain-input/plain-input.component'
import { formControlForOptionsInput, OptionsInput } from './options-input/options-input.component'
import { formControlForMultipleOptionsInput, MultipleOptionsInput } from './multiple-options-input/multiple-options-input.component'
import { formControlForReadOnlyInput, ReadOnlyInput } from './read-only-input/read-only-input.component'
import { BooleanInput, formControlForBooleanInput } from './boolean-input/boolean-input.component'

// FormInput

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
  TextAreaInput |
  BooleanInput |
  OptionsInput<unknown> |
  MultipleOptionsInput<unknown> |
  ReadOnlyInput<unknown, unknown>

export const isOptionsInput = (i: FormInput): i is OptionsInput<unknown> =>
  i.kind === 'options'

// FormInput Combinator

const combine = (
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

export function formControlForInput() {
  return combine([
    formControlForPainInput,
    formControlForOptionsInput,
    formControlForMultipleOptionsInput,
    formControlForReadOnlyInput,
    formControlForBooleanInput
  ])
}

// FormInput Validation

const invalidOptionKey = 'invalidObject'

export const isJSON = (value: unknown): boolean =>
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
