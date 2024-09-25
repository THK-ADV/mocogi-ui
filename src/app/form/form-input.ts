import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'
import {
  formControlForNumberInput,
  formControlForTextInput,
  NumberInput,
  TextAreaInput,
  TextInput,
} from './plain-input/plain-input.component'
import {
  formControlForOptionsInput,
  OptionsInput,
} from './options-input/options-input.component'
import {
  formControlForMultipleOptionsInput,
  MultipleOptionsInput,
} from './multiple-options-input/multiple-options-input.component'
import {
  formControlForReadOnlyInput,
  ReadOnlyInput,
} from './read-only-input/read-only-input.component'
import {
  BooleanInput,
  formControlForBooleanInput,
} from './boolean-input/boolean-input.component'

// FormInput

export interface FormInputLike {
  kind: string
  label: string
  attr: string
  disabled: boolean
  required: boolean
}

export type FormInput<A = never, B = never> =
  | TextInput
  | NumberInput
  | TextAreaInput
  | BooleanInput
  | OptionsInput<A>
  | MultipleOptionsInput<A>
  | ReadOnlyInput<A, B>

export const isOptionsInput = <A, B = never>(
  i: FormInput<A, B>,
): i is OptionsInput<A> => i.kind === 'options'

export const isMultipleOptionsInput = <A, B = never>(
  i: FormInput<A, B>,
): i is MultipleOptionsInput<A> => i.kind === 'multiple-options'

export const isReadOnlyInput = <A, B>(
  i: FormInput<A, B>,
): i is ReadOnlyInput<A, B> => i.kind === 'read-only'

export const isBooleanInput = <A, B>(
  i: FormInput<A, B>,
): i is ReadOnlyInput<A, B> => i.kind === 'boolean'

export const asOptionsInput = <A, B = never>(
  i: FormInput<A, B>,
): OptionsInput<A> | undefined => (isOptionsInput(i) ? i : undefined)

export const asMultipleOptionsInput = <A, B = never>(
  i: FormInput<A, B>,
): MultipleOptionsInput<A> | undefined =>
  isMultipleOptionsInput(i) ? i : undefined

export const asReadOnlyInput = <A, B>(
  i: FormInput<A, B>,
): ReadOnlyInput<A, B> | undefined => (isReadOnlyInput(i) ? i : undefined)

// FormInput Combinator

export const formControlForInput = <A, B>(i: FormInput<A, B>): FormControl => {
  switch (i.kind) {
    case 'text-area':
    case 'text':
      return formControlForTextInput(i)
    case 'number':
      return formControlForNumberInput(i)
    case 'boolean':
      return formControlForBooleanInput(i)
    case 'options':
      return formControlForOptionsInput(i)
    case 'multiple-options':
      return formControlForMultipleOptionsInput(i)
    case 'read-only':
      return formControlForReadOnlyInput(i)
  }
}

// FormInput Validation

const invalidOptionKey = 'invalidObject'

export const isJSON = (value: unknown): boolean => typeof value !== 'string'

const error = () => ({ [invalidOptionKey]: $localize`Invalide Auswahl` })

export const mandatoryOptionsValidator =
  (): ValidatorFn =>
  (ctl: AbstractControl): ValidationErrors | null =>
    !isJSON(ctl.value) || ctl.value === null || ctl.value === ''
      ? error()
      : null

export const optionalOptionsValidator =
  (): ValidatorFn =>
  (ctl: AbstractControl): ValidationErrors | null =>
    ctl.value === '' || isJSON(ctl.value) ? null : error()

export const optionsError = (formControl: FormControl): string | undefined =>
  formControl.hasError(invalidOptionKey)
    ? formControl.getError(invalidOptionKey)
    : undefined

export const requiredError = (
  formControl: FormControl,
  input: FormInputLike,
): string | undefined =>
  formControl.hasError('required')
    ? $localize`${input.label} erforderlich`
    : undefined
