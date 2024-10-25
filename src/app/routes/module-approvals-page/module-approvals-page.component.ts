import { Component, effect, inject, OnInit } from '@angular/core'
import { ApprovalStore } from './approval-store'
import { MatTableDataSource } from '@angular/material/table'
import { Approval } from '../../types/approval'
import { Router } from '@angular/router'

@Component({
  selector: 'cops-module-reviews-page',
  templateUrl: './module-approvals-page.component.html',
  styleUrls: ['./module-approvals-page.component.css'],
  providers: [ApprovalStore],
})
export class ModuleApprovalsPageComponent implements OnInit {
  protected readonly store = inject(ApprovalStore)
  protected readonly dataSource = new MatTableDataSource<Approval>()
  protected readonly displayedColumns: string[] = [
    'title',
    'status',
    'requester',
    'role',
  ]

  constructor(private readonly router: Router) {
    effect(() => {
      this.dataSource.data = this.store.approvals()
    })
  }

  selectRow = async (moduleId: string, approvalId: string) => {
    await this.router.navigate(['modules', moduleId, 'approvals', approvalId])
  }

  ngOnInit(): void {
    this.store.load()
  }
}
