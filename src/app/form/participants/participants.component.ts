import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { formControlForPainInput, NumberInput } from '../plain-input/plain-input.component'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Participants } from '../../http/http.service'
import { validMandatoryNumber } from '../../create-or-update-module/callbacks/callback-validation'

@Component({
  selector: 'sched-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent {
  readonly formGroup: FormGroup
  readonly minInput: NumberInput
  readonly maxInput: NumberInput

  constructor(
    private dialogRef: MatDialogRef<ParticipantsComponent, Participants[]>,
    @Inject(MAT_DIALOG_DATA) participants: Participants | undefined
  ) {
    this.minInput = {
      kind: 'number',
      label: 'Min',
      attr: 'participants-min',
      disabled: false,
      required: true,
      initialValue: participants?.min,
      min: 0
    }
    this.maxInput = {
      kind: 'number',
      label: 'Max',
      attr: 'participants-max',
      disabled: false,
      required: true,
      initialValue: participants?.max,
      min: 1
    }
    this.formGroup = new FormGroup({})
    this.formGroup.addControl('min', formControlForPainInput(this.minInput))
    this.formGroup.addControl('max', formControlForPainInput(this.maxInput))
  }

  static instance = (
    dialog: MatDialog,
    participants: Participants | undefined
  ): MatDialogRef<ParticipantsComponent> =>
    dialog.open<ParticipantsComponent>(
      ParticipantsComponent,
      {
        data: participants,
        minWidth: window.innerWidth * 0.5
      }
    )

  minControl = () =>
    this.formGroup.controls['min'] as FormControl

  maxControl = () =>
    this.formGroup.controls['max'] as FormControl

  cancel = () =>
    this.dialogRef.close()

  applyChanges = () =>
    this.dialogRef.close([{
      min: Number(this.minControl().value),
      max: Number(this.maxControl().value)
    }])

  isValid = () => {
    const max = this.maxControl().value
    const min = this.minControl().value
    return validMandatoryNumber(max) &&
      validMandatoryNumber(min) &&
      +min >= 0 && +min < +max
  }
}
