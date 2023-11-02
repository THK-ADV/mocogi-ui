import { Component, Input } from '@angular/core'
import { ModuleFormComponent } from '../../form/module-form/module-form.component'

@Component({
  selector: 'cops-module-form-actions',
  templateUrl: './module-form-actions.component.html',
  styleUrls: ['./module-form-actions.component.css'],
})
export class ModuleFormActionsComponent {
  @Input() disabled!: boolean
  @Input() cancelAction!: () => void
  @Input() saveAction!: () => void
  @Input() moduleFormComponent: ModuleFormComponent<unknown, unknown> | unknown
}
