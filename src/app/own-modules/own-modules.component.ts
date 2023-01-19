import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
import { TableHeaderColumn } from '../generic-ui/table-header-column'
import { Module } from '../types/module'
import { Either, fold, rightValue } from '../types/either'
import { UserBranch } from '../types/user-branch'
import { ModuleDraft } from '../types/module-draft'
import { AppStateService } from '../state/app-state.service'
import { mapOpt } from '../ops/undefined-ops'

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
  validateChangesTitle = 'Alle Änderungen prüfen'
  branch?: Either<undefined, UserBranch>
  editMode: boolean = false
  username = 'kohls'
  moduleDrafts: ReadonlyArray<ModuleDraft> = []

  private subs: Subscription[] = []

  constructor(
    private readonly router: Router,
    private readonly appState: AppStateService
  ) {
    this.dataSource = new MatTableDataSource<Module>()
    this.columns = [{title: 'Name', attr: 'name'}]
    this.displayedColumns = this.columns.map(_ => _.attr)
    this.displayedColumns.push('action')
    const s1 = appState.usersModules$()
      .subscribe(xs => this.dataSource.data = [...xs])
    const s2 = appState.userBranch$()
      .subscribe(b => this.branch = b)
    const s3 = appState.moduleDrafts$()
      .subscribe(xs => this.moduleDrafts = xs)
    const s4 = appState.editMode$()
      .subscribe(b => this.editMode = b)
    this.subs.push(s1, s2, s3, s4)
  }

  ngOnInit() {
    this.appState.getModulesForUser('cko')
    this.appState.getBranchForUser(this.username)
    this.appState.getEditMode()
    mapOpt(this.branch?.value?.branch, this.appState.getModuleDrafts)
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe())
  }

  // Branch

  editBranch = (e: Either<undefined, UserBranch>) => {
    fold(
      e,
      branch => {
        this.appState.setEditMode(true)
        this.appState.getModuleDrafts(branch.branch)
      },
      () => {
        this.appState.createBranchForUser(
          this.username,
          branch => {
            if (branch.value) {
              this.appState.setEditMode(true)
              this.appState.getModuleDrafts(branch.value.branch)
            }
          })
      }
    )
  }

  titleOfBranch = (e: Either<undefined, UserBranch>) =>
    fold(e, () => 'Änderungen fortsetzen', () => 'Änderungen vornehmen')

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

  // Validation

  validateAllChanges = () => {

  }

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
