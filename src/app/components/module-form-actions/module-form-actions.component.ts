import { Component, Input } from '@angular/core'

@Component({
  selector: 'cops-module-form-actions',
  templateUrl: './module-form-actions.component.html',
  styleUrls: ['./module-form-actions.component.css'],
})
export class ModuleFormActionsComponent {
  @Input() disabled!: boolean
  @Input() cancelAction!: () => void
  @Input() saveAction!: () => void
}
