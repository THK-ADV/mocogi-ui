import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'

export type Approval = {
  title: string,
  requester: string,
}

@Component({
  selector: 'cops-approvals-list',
  templateUrl: './approvals-list.component.html',
  styleUrls: ['./approvals-list.component.css'],
})

export class ApprovalsListComponent {
  protected dataSource = new MatTableDataSource<Approval>()
  protected displayedColumns: string[] = ['title', 'requester', 'actions']

  @Input() set approvals(approvals: ReadonlyArray<Approval> | null) {
    if (approvals) {
      this.dataSource.data = [...approvals]
    }
  }

  selectRow = () => {
    console.log('selected')
  }
}
