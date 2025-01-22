import { Component, Input, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { FormInputLike } from '../form-input'

export interface BooleanInput extends FormInputLike {
  initialValue?: boolean
  kind: 'boolean'
}

export const formControlForBooleanInput = (i: BooleanInput): FormControl =>
  new FormControl(
    { value: i.initialValue ?? false, disabled: i.disabled },
    i.required ? (_) => Validators.required(_) : undefined,
  )

@Component({
  selector: 'cops-boolean-input',
  templateUrl: './boolean-input.component.html',
  styleUrls: ['./boolean-input.component.css'],
  standalone: false,
})
export class BooleanInputComponent implements OnInit {
  value = false

  @Input() formControl!: FormControl
  @Input() input!: BooleanInput

  ngOnInit(): void {
    this.value = this.input.initialValue ?? false
  }
}
