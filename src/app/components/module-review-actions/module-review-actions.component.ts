import { Component, Input } from '@angular/core'

@Component({
  selector: 'cops-module-review-actions',
  templateUrl: './module-review-actions.component.html',
  styleUrls: ['./module-review-actions.component.css'],
})
export class ModuleReviewActionsComponent {
  comment = ''
  @Input() approveAction!: (comment: string) => void
  @Input() rejectAction!: (comment: string) => void
  @Input() cancelAction!: () => void
}
