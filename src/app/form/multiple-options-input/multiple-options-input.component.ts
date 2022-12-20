import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { FormInput, FormInputLike, optionsError, requiredError } from '../form-input'
import { EMPTY, map, Observable, startWith, Subscription } from 'rxjs'

export interface MultipleOptionsInput<A> extends FormInputLike {
  kind: 'multiple-options'
  data: Observable<A[]>
  show: (a: A) => string
  initialValue?: (as: A[]) => A[]
}

export const formControlForMultipleOptionsInput = (i: FormInput): FormControl | undefined => {
  switch (i.kind) {
    case 'multiple-options':
      return new FormControl(
        {value: [], disabled: i.disabled},
        i.required ? Validators.required : undefined
      )
    default:
      return undefined
  }
}

@Component({
  selector: 'sched-multiple-options-input',
  templateUrl: './multiple-options-input.component.html',
  styleUrls: ['./multiple-options-input.component.css']
})
export class MultipleOptionsInputComponent<A> implements OnInit, OnDestroy {
  @Input() input!: MultipleOptionsInput<A>
  @Input() formControl!: FormControl<A[]>

  options: A[] = []
  selected: A[] = []
  filteredOptions: Observable<A[]> = EMPTY
  lastFilter = ''

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
      this.selected = initialValue
    }
  }

  private initFilterOptions = () => {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.lastFilter),
      map(value => this.filter(value))
    )
  }

  private filter = (input: string): A[] => {
    this.lastFilter = input
    if (this.input) {
      const filterValue = input.toLowerCase()
      return this.options.filter(t => this.input.show(t).toLowerCase().indexOf(filterValue) >= 0)
    } else {
      return this.options.slice()
    }
  }

  displayFn = (value?: A): string => {
    return (value && this.input.show(value)) ?? ''
  }

  reset = () => {
    this.formControl.reset(undefined, {emitEvent: false})
    this.initFilterOptions()
  }

  getErrorMessage = () =>
    requiredError(this.formControl, this.input) ?? optionsError(this.formControl)

  isSelected = (a: A) => this.selected.includes(a)

  toggleSelection = (a: A) => {
    if (this.selected.includes(a)) {
      const index = this.selected.indexOf(a, 0)
      index > -1 && this.selected.splice(index, 1)
    } else {
      this.selected.push(a)
    }
    this.formControl.setValue(this.selected)
  }

  optionClicked = (event: Event, a: A) => {
    event.stopPropagation()
    this.toggleSelection(a)
  }

  onFocusOut = () => {
    this.formControl.setValue(this.selected)
  }

  onFocusIn = () => {
    this.reset()
    this.onFocusOut()
  }
}
