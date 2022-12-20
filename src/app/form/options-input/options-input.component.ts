import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormInput, FormInputLike, mandatoryOptionsValidator, optionalOptionsValidator, optionsError, requiredError } from '../form-input'
import { EMPTY, map, Observable, startWith, Subscription } from 'rxjs'
import { FormControl, Validators } from '@angular/forms'

export interface OptionsInput<A> extends FormInputLike {
  kind: 'options'
  data: Observable<A[]>
  show: (a: A) => string
  initialValue?: (as: A[]) => A | undefined
}

export const formControlForOptionsInput = (i: FormInput): FormControl | undefined => {
  switch (i.kind) {
    case 'options':
      const fc = new FormControl(
        {value: undefined, disabled: i.disabled}
      )
      if (i.required) {
        fc.addValidators([Validators.required, mandatoryOptionsValidator()])
      } else {
        fc.addValidators(optionalOptionsValidator())
      }
      return fc
    default:
      return undefined
  }
}

@Component({
  selector: 'sched-options-input',
  templateUrl: './options-input.component.html',
  styleUrls: ['./options-input.component.css']
})
export class OptionsInputComponent<A> implements OnInit, OnDestroy {

  @Input() input!: OptionsInput<A>
  @Input() formControl!: FormControl

  options: A[] = []
  filteredOptions: Observable<A[]> = EMPTY

  private sub?: Subscription

  ngOnInit(): void {
    this.observeData()
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  private observeData = () => {
    this.sub = this.input.data.subscribe(data => {
      this.options = data ?? []
      this.selectInitialValue()
      this.initFilterOptions()
    })
  }

  private selectInitialValue = () => {
    if (this.input.initialValue) {
      const initialValue = this.input.initialValue(this.options)
      this.formControl.setValue(initialValue)
    }
  }

  private initFilterOptions = () => {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.input.show(value)),
      map(value => value ? this.filter(value) : this.options.slice())
    )
  }

  private filter = (input: string): A[] => {
    const filterValue = input.toLowerCase()
    return this.options.filter(t => this.input.show(t).toLowerCase().indexOf(filterValue) >= 0)
  }

  displayFn = (value?: A): string =>
    (value && this.input.show(value)) ?? ''

  reset = () => {
    this.formControl.reset(undefined, {emitEvent: false})
    this.initFilterOptions()
  }

  getErrorMessage = () =>
    requiredError(this.formControl, this.input) ?? optionsError(this.formControl)
}
