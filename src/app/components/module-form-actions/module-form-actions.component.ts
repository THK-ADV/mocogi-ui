import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'cops-module-form-actions',
  templateUrl: './module-form-actions.component.html',
  styleUrls: ['./module-form-actions.component.css'],
  standalone: false,
})
export class ModuleFormActionsComponent implements OnInit {
  updateInProcess0 = false
  spinnerDiameter = 30

  @Input() cancelAction!: () => void
  @Input() saveAction!: () => void
  @Input() isValid!: () => boolean

  @Input() set updateInProcess(bool: boolean | null) {
    this.updateInProcess0 = bool ?? false
  }

  @ViewChild('cancelButton', { static: true }) cancelButtonRef!: MatButton

  ngOnInit() {
    this.spinnerDiameter =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,no-underscore-dangle
      this.cancelButtonRef._elementRef.nativeElement.offsetHeight * 0.5
  }
}
