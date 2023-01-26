import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'
import { TableHeaderColumn } from '../generic-ui/table-header-column'
import { Module } from '../types/module'
import { Either, fold } from '../types/either'
import { UserBranch } from '../types/user-branch'
import { ModuleDraft } from '../types/module-draft'
import { AppStateService } from '../state/app-state.service'
import { PipelineError } from '../types/pipeline-error'
import { mapOpt } from '../ops/undefined-ops'

@Component({
  selector: 'sched-own-modules',
  templateUrl: './own-modules.component.html',
  styleUrls: ['./own-modules.component.scss']
})
export class OwnModulesComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<[Module, ModuleDraft | undefined]>
  columns: TableHeaderColumn[]
  displayedColumns: string[]
  headerTitle = 'Meine Module'
  validateChangesTitle = 'Alle Änderungen prüfen'
  branch?: Either<undefined, UserBranch>
  editMode: boolean = false
  username = 'kohls'
  pipelineErrors: ReadonlyArray<PipelineError> = []

  private subs: Subscription[] = []

  constructor(
    private readonly router: Router,
    private readonly appState: AppStateService
  ) {
    this.dataSource = new MatTableDataSource()
    this.columns = [{title: 'Name', attr: 'name'}]
    this.displayedColumns = this.columns.map(_ => _.attr)
    this.displayedColumns.push('action')
    const s0 = appState.usersModules$()
      .subscribe(xs => this.dataSource.data = xs.map(a => [a, undefined]))
    const s1 = appState.usersDraftingModules$()
      .subscribe(xs => this.dataSource.data = [...xs])
    const s2 = appState.userBranch$()
      .subscribe(b => this.branch = b)
    const s3 = appState.editMode$()
      .subscribe(b => this.editMode = b)
    const s4 = appState.pipelineErrors$()
      .subscribe(xs => this.pipelineErrors = xs)
    this.subs.push(s0, s1, s2, s3, s4)
  }

  ngOnInit() {
    this.appState.getModulesForUser('cko')
    this.appState.getBranchForUser(this.username)
    this.appState.getEditMode()
    this.editMode && mapOpt(this.branch?.value?.branch, this.appState.getModuleDrafts)
    this.appState.getPipelineErrors()
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

  onEdit = ([module, draft]: [Module, ModuleDraft | undefined]) =>
    this.router.navigate(
      ['/edit'],
      {
        state: {
          id: module.id,
          moduleCompendium: draft?.data
        },
        queryParams: {
          action: 'update'
        }
      }
    )

  show = ([m, d]: [Module, ModuleDraft | undefined]) => {
    this.router.navigate(['/show'], {state: {id: m.id}})
  }

  onCreate = () =>
    this.router.navigate(['/edit'], {queryParams: {action: 'create'}})

  // Validation

  validateAllChanges = () => {
    this.appState.getPipelineErrors()
  }

  // Table

  tableContent = ([module, draft]: [Module, ModuleDraft | undefined], attr: string): string => {
    switch (attr) {
      case 'name':
        let str = draft ? draft.data.metadata.title : module.title
        if (draft) {
          str += ` (${draft.status})`
        }
        return str
      default:
        return '???'
    }
  }

  tableColor = ([, draft]: [Module, ModuleDraft | undefined]) => {
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

  showPipelineError = (e: PipelineError): string => {
    switch (e.kind) {
      case 'parsing-error':
        return JSON.stringify(e.error)
      case 'printing-error':
        return JSON.stringify(e.error)
      case 'validation-error':
        return JSON.stringify(e.error)
    }
  }
}
