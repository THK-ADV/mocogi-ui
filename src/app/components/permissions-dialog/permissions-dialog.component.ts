import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips'
import { Store } from '@ngrx/store'
import { PermissionsDialogActions } from '../../state/actions/permissions-dialog.actions'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { selectPermissions } from '../../state/selectors/permissions-dialog.selector'

@Component({
  selector: 'cops-permissions-dialog',
  templateUrl: './permissions-dialog.component.html',
  styleUrls: ['./permissions-dialog.component.css'],
})
export class PermissionsDialogComponent implements OnInit {
  @ViewChild('campusIdInput') campusIdInput?: HTMLInputElement
  permissions$: Observable<ReadonlyArray<string>>
  public permissions: Array<string> = []
  public moduleId: string
  moduleTitle: string

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { moduleId: string; moduleTitle: string },
    private store: Store,
  ) {
    this.permissions$ = store.select(selectPermissions)
    this.moduleId = data.moduleId
    this.moduleTitle = data.moduleTitle
  }

  ngOnInit() {
    this.store.dispatch(
      PermissionsDialogActions.enter({ moduleId: this.moduleId }),
    )
  }

  add = (event: MatChipInputEvent) => {
    const campusId = (event.value || '').trim()
    if (!campusId) {
      return
    }
    this.store.dispatch(PermissionsDialogActions.add({ campusId }))
    event.chipInput?.clear()
  }

  remove = (campusId: string) => {
    this.store.dispatch(PermissionsDialogActions.remove({ campusId }))
  }

  edit(campusId: string, event: MatChipEditedEvent) {
    const newCampusId = event.value.trim()

    if (!newCampusId) {
      this.remove(campusId)
      return
    }

    this.store.dispatch(
      PermissionsDialogActions.edit({
        changedCampusId: campusId,
        newValue: newCampusId,
      }),
    )
  }

  save = () => {
    if (!this.moduleId) {
      return
    }
    this.store.dispatch(
      PermissionsDialogActions.save({ moduleId: this.moduleId }),
    )
  }
  protected readonly COMMA = COMMA
  protected readonly ENTER = ENTER
}
