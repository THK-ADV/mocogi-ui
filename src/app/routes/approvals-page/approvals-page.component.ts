import { Component } from '@angular/core'
import { Approval } from '../../components/approvals/approvals-list/approvals-list.component'

@Component({
  selector: 'cops-approvals-page',
  templateUrl: './approvals-page.component.html',
  styleUrls: ['./approvals-page.component.css'],
})
export class ApprovalsPageComponent {
  approvals: ReadonlyArray<Approval> = [
    { title: 'Spezielle Gebiete der Mathematik (SGM)', requester: 'Ane Schmitter' },
    { title: 'Approval no. 2', requester: 'Christian Kohls' },
    { title: 'Approval no. 3', requester: 'Christian Kohls' },
    { title: 'Approval no. 4', requester: 'Christian Kohls' },
  ]
}
