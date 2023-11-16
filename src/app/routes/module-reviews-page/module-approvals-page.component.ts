import { Component } from '@angular/core'
import { HttpService } from '../../http/http.service'
import { Approval } from '../../types/approval'

@Component({
  selector: 'cops-module-reviews-page',
  templateUrl: './module-approvals-page.component.html',
  styleUrls: ['./module-approvals-page.component.css'],
})
export class ModuleApprovalsPageComponent {
  approvals: ReadonlyArray<Approval> = []

  constructor(http: HttpService) {
    http.ownApprovals().subscribe((approvals) => {
      this.approvals = approvals
    })
  }
}
