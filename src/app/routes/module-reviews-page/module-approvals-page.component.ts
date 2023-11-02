import { Component } from '@angular/core'
import { Approval } from '../../components/approvals/approvals-list/approvals-list.component'

@Component({
  selector: 'cops-module-reviews-page',
  templateUrl: './module-approvals-page.component.html',
  styleUrls: ['./module-approvals-page.component.css'],
})
export class ModuleApprovalsPageComponent {
  approvals: ReadonlyArray<Approval> = [
    { title: 'Spezielle Gebiete der Mathematik (SGM)', requester: 'Ane Schmitter', moduleId: 'e37c5af9-6076-4f15-8c8b-d206b7091bc0' },
    { title: 'Approval no. 2', requester: 'Christian Kohls', moduleId: 'e37c5af9-6076-4f15-8c8b-d206b7091bc0' },
    { title: 'Approval no. 3', requester: 'Christian Kohls', moduleId: 'e37c5af9-6076-4f15-8c8b-d206b7091bc0' },
    { title: 'Approval no. 4', requester: 'Christian Kohls', moduleId: 'e37c5af9-6076-4f15-8c8b-d206b7091bc0' },
  ]
}
