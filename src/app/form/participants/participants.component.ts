import { Component, Inject } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import {
  formControlForNumberInput,
  NumberInput,
} from '../plain-input/plain-input.component'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { validMandatoryNumber } from '../../create-or-update-module/callbacks/callback-validation'
import { Participants } from '../../types/participants'

@Component({
  selector: 'cops-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css'],
})
export class ParticipantsComponent {
  readonly headerTitle: string
  readonly formGroup: FormGroup
  readonly minInput: NumberInput
  readonly maxInput: NumberInput

  get minControl(): FormControl {
    return this.formGroup.get('min') as FormControl
  }

  get maxControl(): FormControl {
    return this.formGroup.get('max') as FormControl
  }

  constructor(
    private dialogRef: MatDialogRef<ParticipantsComponent, Participants[]>,
    @Inject(MAT_DIALOG_DATA) participants: Participants | undefined,
  ) {
    this.headerTitle = $localize`Teilnehmerbegrenzung bearbeiten`
    this.minInput = {
      kind: 'number',
      label: $localize`Min`,
      attr: 'participants-min',
      disabled: false,
      required: true,
      initialValue: participants?.min,
      min: 0,
    }
    this.maxInput = {
      kind: 'number',
      label: $localize`Max`,
      attr: 'participants-max',
      disabled: false,
      required: true,
      initialValue: participants?.max,
      min: 1,
    }
    this.formGroup = new FormGroup({})
    this.formGroup.addControl('min', formControlForNumberInput(this.minInput))
    this.formGroup.addControl('max', formControlForNumberInput(this.maxInput))
  }

  static instance = (
    dialog: MatDialog,
    participants: Participants | undefined,
  ): MatDialogRef<ParticipantsComponent> =>
    dialog.open<ParticipantsComponent>(ParticipantsComponent, {
      data: participants,
      minWidth: window.innerWidth * 0.5,
    })

  cancel = () => this.dialogRef.close()

  applyChanges = () =>
    this.dialogRef.close([
      {
        min: Number(this.minControl.value),
        max: Number(this.maxControl.value),
      },
    ])

  isValid = () => {
    const max: unknown = this.maxControl.value
    const min: unknown = this.minControl.value
    if (!(validMandatoryNumber(max) && validMandatoryNumber(min))) {
      return false
    }
    const maxNu = Number(max)
    const minNu = Number(min)
    return minNu >= 0 && minNu < maxNu
  }

  delete = () => this.dialogRef.close([])
}
