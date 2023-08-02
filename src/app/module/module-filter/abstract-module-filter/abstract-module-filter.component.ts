import { Component, Input } from '@angular/core'
import { EMPTY, map, Observable, startWith } from 'rxjs'
import { TypedAction } from '@ngrx/store/src/models'
import { FormControl } from '@angular/forms'
import { Store } from '@ngrx/store'

@Component({
  selector: 'cops-abstract-module-filter',
  templateUrl: './abstract-module-filter.component.html',
  styleUrls: ['./abstract-module-filter.component.css'],
})
export class AbstractModuleFilterComponent<A> {

  @Input() label!: string
  @Input() show!: (a: A) => string
  @Input() selectAction!: (a: A) => TypedAction<string>
  @Input() deselectAction!: () => TypedAction<string>

  @Input() set selection(a: A | undefined | null) {
    a ? this.formControl.setValue(a) : this.reset()
  }

  @Input() set options(as: ReadonlyArray<A> | null) {
    this.options_ = as ?? []
    this.initFilterOptions()
  }

  protected options_!: ReadonlyArray<A>
  protected filteredOptions: Observable<A[]> = EMPTY
  protected formControl = new FormControl()

  constructor(private readonly store: Store) {
  }

  private initFilterOptions = () => {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : this.show(value)),
      map(value => value ? this.filter(value) : this.options_.slice()),
    )
  }

  private filter = (input: string): A[] => {
    const filterValue = input.toLowerCase()
    return this.options_.filter(t => this.show(t).toLowerCase().indexOf(filterValue) >= 0)
  }

  displayFn = (value?: A): string =>
    (value && this.show(value)) ?? ''

  selectOption = (a: A) => {
    this.store.dispatch(this.selectAction(a))
  }

  resetFilter = ($event: MouseEvent) => {
    this.store.dispatch(this.deselectAction())
    $event.stopPropagation()
  }

  private reset = () => {
    this.formControl.reset(undefined, {emitEvent: false})
    this.initFilterOptions()
  }
}
