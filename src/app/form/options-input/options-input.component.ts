import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormInputLike, mandatoryOptionsValidator, optionalOptionsValidator, optionsError, requiredError } from '../form-input'
import { EMPTY, map, Observable, startWith, Subscription } from 'rxjs'
import { FormControl, Validators } from '@angular/forms'

export interface OptionsInput<A> extends FormInputLike {
  kind: 'options'
  data: A[] | Observable<A[]>
  show: (a: A) => string
  initialValue?: (as: A[]) => A | undefined
}

export const formControlForOptionsInput = <A>(i: OptionsInput<A>): FormControl => {
  const fc = new FormControl<A | undefined>(
    {value: undefined, disabled: i.disabled},
    i.required ? [Validators.required, mandatoryOptionsValidator()] : optionalOptionsValidator(),
  )
  // fixes ExpressionChangedAfterItHasBeenCheckedError bug
  if (Array.isArray(i.data)) {
    const initialValue = i.initialValue?.(i.data)
    fc.setValue(initialValue)
  }
  return fc
}

@Component({
  selector: 'cops-options-input',
  templateUrl: './options-input.component.html',
  styleUrls: ['./options-input.component.css'],
})
export class OptionsInputComponent<A> implements OnInit, OnDestroy {

  @Input() input!: OptionsInput<A>
  @Input() formControl!: FormControl
  @Output() optionSelected = new EventEmitter<A>()

  options: A[] = []
  filteredOptions: Observable<A[]> = EMPTY

  private sub?: Subscription

  ngOnInit(): void {
    this.initData()
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  private initData = () => {
    if (Array.isArray(this.input.data)) {
      this.options = this.input.data
      this.initFilterOptions()
    } else {
      this.sub = this.input.data.subscribe(data => {
        this.options = data ?? []
        this.setInitialState()
        this.initFilterOptions()
      })
    }
  }

  private setInitialState = () => {
    if (this.input.initialValue) {
      const initialValue = this.input.initialValue(this.options)
      this.formControl.setValue(initialValue)
    }
  }

  private initFilterOptions = () => {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.input.show(value)),
      map(value => value ? this.filter(value) : this.options.slice()),
    )
  }

  private filter = (input: string): A[] => {
    const filterValue = input.toLowerCase()
    return this.options.filter(t => this.input.show(t).toLowerCase().indexOf(filterValue) >= 0)
  }

  // UI functions

  displayFn = (value?: A): string =>
    (value && this.input.show(value)) ?? ''

  getErrorMessage = () =>
    requiredError(this.formControl, this.input) ?? optionsError(this.formControl)

  // Public API

  removeOption = (a: A) => {
    const index = this.options.indexOf(a, 0)
    index > -1 && this.options.splice(index, 1)
  }

  addOption = (a: A) => {
    this.options.push(a)
  }

  reset = () => {
    this.formControl.reset(undefined, {emitEvent: false})
    this.initFilterOptions()
  }
}
