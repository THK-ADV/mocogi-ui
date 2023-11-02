import { Component } from '@angular/core'
import { Approval } from '../../components/approvals/approvals-list/approvals-list.component'
import { HttpService } from '../../http/http.service'

@Component({
  selector: 'cops-module-reviews-page',
  templateUrl: './module-approvals-page.component.html',
  styleUrls: ['./module-approvals-page.component.css'],
})
export class ModuleApprovalsPageComponent {
  approvals: ReadonlyArray<Approval> = []

  constructor(http: HttpService) {
    http.ownApprovals().subscribe((approvals) => {
      console.log(approvals)
      this.approvals = approvals
    })
  }
}
