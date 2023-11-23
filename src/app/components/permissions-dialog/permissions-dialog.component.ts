import { Component, ViewChild } from '@angular/core'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips'

@Component({
  selector: 'cops-permissions-dialog',
  templateUrl: './permissions-dialog.component.html',
  styleUrls: ['./permissions-dialog.component.css'],
})
export class PermissionsDialogComponent {
  @ViewChild('campusIdInput') campusIdInput?: HTMLInputElement
  public permissions: Array<string> = []

  add = (event: MatChipInputEvent) => {
    const campusId = (event.value || '').trim()
    if (campusId) this.permissions = Array.from(new Set([...this.permissions, campusId]))
    event.chipInput?.clear()
  }

  remove = (campusId: string) => {
    this.permissions = [...this.permissions].filter((campusIdFromList) => campusIdFromList !== campusId)
  }

  edit(campusId: string, event: MatChipEditedEvent) {
    const newCampusId = event.value.trim()

    // Remove fruit if it no longer has a name
    if (!newCampusId) {
      this.remove(campusId)
      return
    }

    // Edit existing fruit
    this.permissions[this.permissions.indexOf(campusId)] = newCampusId
  }
  protected readonly COMMA = COMMA
  protected readonly ENTER = ENTER
}
