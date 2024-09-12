import { Component, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { asMultipleOptionsInput, asOptionsInput, asReadOnlyInput, formControlForInput, FormInput } from '../form-input'
import { NumberInput, TextInput } from '../plain-input/plain-input.component'
import { BooleanInput } from '../boolean-input/boolean-input.component'
import { throwError } from '../../types/error'
import { NonEmptyArray } from 'src/app/types/non-empty-array'

export type Language = 'de' | 'en'

export type LocalizedInput<A, B> = { input: FormInput<A, B>, language?: Language }

export type Section<A, B> = {
  header: string,
  rows: Rows<A, B>
}

export type Rows<A, B> = {
  [key: string]: NonEmptyArray<LocalizedInput<A, B>>
}

export interface ModuleForm<A, B> {
  objectName: string
  editType: EditType
  sections: Section<A, B>[]
}

type EditType = 'create' | 'update'

@Component({
  selector: 'cops-module-form',
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.css'],
})
export class ModuleFormComponent<A, B> implements OnInit {

  @Input() moduleForm!: ModuleForm<A, B>
  @Input() mode!: 'CREATE' | 'UPDATE' | 'REVIEW'
  @Input() onCancel?: () => void
  @Input() formGroup!: FormGroup

  title = ''
  buttonTitle = ''

  ngOnInit() {
    this.buttonTitle = this.moduleForm.editType === 'create' ? $localize`Erstellen` : $localize`Aktualisieren`
    this.title = `${this.moduleForm.objectName} ${this.buttonTitle.toLowerCase()}`
    this.moduleForm.sections.forEach(section =>
      Object.values(section.rows).forEach(row =>
        row.forEach(({input}) => {
          const fc = formControlForInput(input)
          if (input.disabled || this.mode === 'REVIEW') {
            fc.disable()
          }
          this.formGroup.addControl(input.attr, fc)
        })
      )
    )
  }

  cancel = () =>
    this.onCancel?.()

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

  originalOrder = (): number => {
    return 0
  }
}
