import { Component, Inject } from '@angular/core'
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog'

interface ConfirmationPayload {
  title: string
  value: string
}

export type ConfirmationResult = 'ok' | 'ko'

@Component({
  selector: 'cops-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent, ConfirmationResult>,
    @Inject(MAT_DIALOG_DATA) readonly payload: ConfirmationPayload,
  ) {
  }

  static instance = (
    dialog: MatDialog,
    payload: ConfirmationPayload,
  ): MatDialogRef<ConfirmationDialogComponent, ConfirmationResult> =>
    dialog.open<ConfirmationDialogComponent, ConfirmationPayload, ConfirmationResult>(
      ConfirmationDialogComponent, {
        data: payload,
      },
    )

  cancel = () =>
    this.dialogRef.close('ko')

  submit = () =>
    this.dialogRef.close('ok')
}
