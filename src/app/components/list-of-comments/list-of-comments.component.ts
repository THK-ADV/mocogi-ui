import { Component, Input } from '@angular/core'
import { Approval } from '../../types/approval'

@Component({
  selector: 'cops-list-of-comments',
  templateUrl: './list-of-comments.component.html',
  styleUrls: ['./list-of-comments.component.css'],
  standalone: false,
})
export class ListOfCommentsComponent {
  @Input()
  approvals: ReadonlyArray<Approval> = []
  replies = () =>
    this.approvals
      .filter((approval) => approval.status.id !== 'pending')
      .sort((current, next) =>
        current.respondedAt.localeCompare(next.respondedAt),
      )
}
