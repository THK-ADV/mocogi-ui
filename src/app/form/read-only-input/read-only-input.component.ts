import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { FormInput, FormInputLike, requiredError } from '../form-input'
import { MatDialogRef } from '@angular/material/dialog'
import { Subscription } from 'rxjs'

export interface ReadOnlyInput<Option, Output> extends FormInputLike {
  kind: 'read-only'
  options: Option[]
  show: (output: Output) => string
  initialValue?: (as: Option[]) => Output[]
  dialogInstance: () => MatDialogRef<any, Output[]>
}

export const formControlForReadOnlyInput = (i: FormInput): FormControl | undefined => {
  switch (i.kind) {
    case 'read-only':
      return new FormControl(
        {value: i.initialValue, disabled: i.disabled},
        i.required ? Validators.required : undefined
      )
    default:
      return undefined
  }
}

@Component({
  selector: 'sched-read-only-input',
  templateUrl: './read-only-input.component.html',
  styleUrls: ['./read-only-input.component.css']
})
export class ReadOnlyInputComponent<A, DialogEntry> implements OnInit, OnDestroy {
  @Input() formControl!: FormControl
  @Input() input!: ReadOnlyInput<A, DialogEntry>

  private sub?: Subscription

  ngOnInit() {
    this.initData()
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

  initData = () => {
    if (this.input.initialValue) {
      const options = this.input.initialValue(this.input.options)
      this.setData(options)
    }
  }

  setData = (entries: DialogEntry[]) => {
    // toString is used by formControl to display the value
    const options = entries.map(a => ({value: a, toString: () => this.input.show(a)}))
    this.formControl.setValue(options)
  }

  getErrorMessage = () =>
    requiredError(this.formControl, this.input)

  onEdit = () => {
    this.sub?.unsubscribe()
    this.sub = this.input.dialogInstance()
      .afterClosed()
      .subscribe(res => {
        if (res !== undefined) {
          this.setData(res)
        }
      })
  }
}
