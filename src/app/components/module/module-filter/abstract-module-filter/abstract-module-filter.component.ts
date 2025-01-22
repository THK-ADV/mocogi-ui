import { Component, Input } from '@angular/core'
import { EMPTY, map, Observable, startWith } from 'rxjs'
import { FormControl } from '@angular/forms'
import { Action, Store } from '@ngrx/store'

@Component({
  selector: 'cops-abstract-module-filter',
  templateUrl: './abstract-module-filter.component.html',
  styleUrls: ['./abstract-module-filter.component.css'],
  standalone: false,
})
export class AbstractModuleFilterComponent<A> {
  @Input() label!: string
  @Input() show!: (a: A) => string
  @Input() selectAction!: (a: A) => Action<string>
  @Input() deselectAction!: () => Action<string>
  @Input() id!: (a: A) => string

  @Input() set selection(a: A | undefined | null) {
    if (a) {
      this.formControl.setValue(a)
    } else {
      this.reset()
    }
  }

  @Input() set options(as: ReadonlyArray<A> | null) {
    this.options0 = as ?? []
    this.initFilterOptions()
  }

  protected options0!: ReadonlyArray<A>
  protected filteredOptions: Observable<A[]> = EMPTY
  protected formControl = new FormControl()

  constructor(private readonly store: Store) {}

  private initFilterOptions = () => {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string' ? value : this.show(value as A),
      ),
      map((value) => (value ? this.filter(value) : this.options0.slice())),
    )
  }

  private filter = (input: string): A[] => {
    const filterValue = input.toLowerCase()
    return this.options0.filter(
      (t) => this.show(t).toLowerCase().indexOf(filterValue) >= 0,
    )
  }

  displayFn = (value?: A): string => (value && this.show(value)) ?? ''

  selectOption = (a: A) => {
    this.store.dispatch(this.selectAction(a))
  }

  resetFilter = ($event: MouseEvent) => {
    this.store.dispatch(this.deselectAction())
    $event.stopPropagation()
  }

  private reset = () => {
    this.formControl.reset(undefined, { emitEvent: false })
    this.initFilterOptions()
  }
}
