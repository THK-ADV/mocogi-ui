import { Component, OnDestroy, OnInit } from '@angular/core'
import { HttpService } from '../http/http.service'
import { Subscription } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
import { TableHeaderColumn } from '../generic-ui/table-header-column'
import { Module } from '../types/module'
import { either, Either, fold, right, rightValue } from '../types/either'
import { UserBranch } from '../types/user-branch'
import { ModuleDraft } from '../types/module-draft'

@Component({
  selector: 'sched-own-modules',
  templateUrl: './own-modules.component.html',
  styleUrls: ['./own-modules.component.scss']
})
export class OwnModulesComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<Module>
  columns: TableHeaderColumn[]
  displayedColumns: string[]
  headerTitle = 'Meine Module'
  branch?: Either<undefined, UserBranch>
  editMode: boolean = false
  username = 'kohls'
  moduleDrafts: ModuleDraft[] = []

  private subs: Subscription[] = []

  constructor(private readonly http: HttpService, private readonly router: Router) {
    this.dataSource = new MatTableDataSource<Module>()
    this.columns = [{title: 'Name', attr: 'name'}]
    this.displayedColumns = this.columns.map(_ => _.attr)
    this.displayedColumns.push('action')
  }

  ngOnInit() {
    this.subs.push(
      this.http.allModulesForUser('cko')
        .subscribe(xs => this.dataSource.data = xs),
      this.http.branchForUser(this.username)
        .subscribe(branch => this.branch = either(
          branch !== undefined,
          () => branch!,
          () => undefined)
        )
    )
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe())
  }

  // Branch

  editBranch = (e: Either<undefined, UserBranch>) => {
    fold(
      e,
      branch => {
        this.editMode = true
        this.getModelsDrafts(branch.branch)
      },
      () => {
        this.subs.push(
          this.http.createBranch(this.username)
            .subscribe(branch => {
              if (branch) {
                this.branch = right(branch)
                this.editMode = true
                this.getModelsDrafts(branch.branch)
              }
            })
        )
      }
    )
  }

  titleOfBranch = (e: Either<undefined, UserBranch>) =>
    fold(e, () => 'Änderungen fortsetzen', () => 'Änderungen vornehmen')

  // Module Drafts

  getModelsDrafts = (branch: string) => {
    this.subs.push(
      this.http.moduleDrafts(branch)
        .subscribe(drafts => this.moduleDrafts = drafts)
    )
  }

  // Navigation

  onEdit = (m: Module) =>
    this.router.navigate(
      ['/edit'],
      {
        state: {
          id: m.id,
          branch: rightValue(this.branch!).branch,
          moduleCompendium: this.moduleDrafts.find(d => d.module === m.id)
        },
        queryParams: {
          action: 'update'
        }
      }
    )

  onSelect = (m: Module) => {

  }

  onCreate = () =>
    this.router.navigate(['/edit'], {queryParams: {action: 'create'}})

  // Table

  tableContent = (m: Module, attr: string): string => {
    switch (attr) {
      case 'name':
        let str = m.title
        const draft = this.moduleDrafts.find(d => d.module === m.id)
        if (draft) {
          str += ` (${draft.status})`
        }
        return str
      default:
        return '???'
    }
  }

  tableColor = (m: Module) => {
    const draft = this.moduleDrafts.find(d => d.module === m.id)
    if (!draft) {
      return '#000000'
    }
    switch (draft.status) {
      case 'added':
        return '#309656'
      case 'modified':
        return '#bd4c1a'
    }
  }
}
