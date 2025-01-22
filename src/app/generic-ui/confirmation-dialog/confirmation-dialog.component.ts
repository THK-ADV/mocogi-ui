import { Component, Inject } from '@angular/core'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'

interface ConfirmationPayload {
  title: string
  value: string
}

export type ConfirmationResult = 'ok' | 'ko'

@Component({
  selector: 'cops-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
  standalone: false,
})
export class ConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<
      ConfirmationDialogComponent,
      ConfirmationResult
    >,
    @Inject(MAT_DIALOG_DATA) readonly payload: ConfirmationPayload,
  ) {}

  static instance = (
    dialog: MatDialog,
    payload: ConfirmationPayload,
  ): MatDialogRef<ConfirmationDialogComponent, ConfirmationResult> =>
    dialog.open<
      ConfirmationDialogComponent,
      ConfirmationPayload,
      ConfirmationResult
    >(ConfirmationDialogComponent, {
      data: payload,
    })

  cancel = () => this.dialogRef.close('ko')

  submit = () => this.dialogRef.close('ok')
}
