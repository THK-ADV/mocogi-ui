import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { Store } from '@ngrx/store'
import { NavigationActions } from '../../../state/actions/navigation.actions'
import { Approval } from '../../../types/approval'

@Component({
  selector: 'cops-approvals-list',
  templateUrl: './approvals-list.component.html',
  styleUrls: ['./approvals-list.component.css'],
})
export class ApprovalsListComponent {
  protected dataSource = new MatTableDataSource<Approval>()
  protected displayedColumns: string[] = [
    'title',
    'status',
    'requester',
    'role',
  ]

  constructor(private store: Store) {}

  @Input() set approvals(approvals: ReadonlyArray<Approval> | null) {
    if (approvals) {
      this.dataSource.data = [...approvals]
    }
  }

  selectRow = (moduleId: string, approvalId: string) => {
    this.store.dispatch(
      NavigationActions.navigate({
        path: ['modules', moduleId, 'approvals', approvalId],
      }),
    )
  }
}
