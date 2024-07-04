import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'cops-module-form-actions',
  templateUrl: './module-form-actions.component.html',
  styleUrls: ['./module-form-actions.component.css'],
})
export class ModuleFormActionsComponent implements OnInit {
  updateInProcess_ = false
  spinnerDiameter = 30

  @Input() cancelAction!: () => void
  @Input() saveAction!: () => void
  @Input() isValid!: () => boolean

  @Input() set updateInProcess(bool: boolean | null) {
    this.updateInProcess_ = bool ?? false
  }

  @ViewChild('cancelButton', {static: true}) cancelButtonRef!: MatButton

  ngOnInit() {
    this.spinnerDiameter = this.cancelButtonRef._elementRef.nativeElement.offsetHeight * 0.9
  }
}
