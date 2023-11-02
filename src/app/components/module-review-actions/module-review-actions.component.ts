import { Component, Input } from '@angular/core'

@Component({
  selector: 'cops-module-review-actions',
  templateUrl: './module-review-actions.component.html',
  styleUrls: ['./module-review-actions.component.css'],
})
export class ModuleReviewActionsComponent {
  @Input() approveAction!: () => void
  @Input() rejectAction!: () => void
  @Input() cancelAction!: () => void
}
