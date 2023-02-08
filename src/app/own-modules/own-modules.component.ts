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
import { PipelineError, ValidationResult } from '../types/validation-result'

// TODO add proper State Management

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
  validateChangesTitle = 'Änderungen auf Korrektheit prüfen'
  reviewTitle = 'Änderungen zum Review freigeben'
  revertReviewTitle = 'Review zurückziehen'
  branch?: Either<undefined, UserBranch>
  editMode = false
  username = 'kohls'
  validationResult?: ValidationResult

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
      .subscribe(x => this.branch = x)
    const s3 = appState.editMode$()
      .subscribe(x => this.editMode = x)
    const s4 = appState.validationResult$()
      .subscribe(x => this.validationResult = x)
    this.subs.push(s0, s1, s2, s3, s4)
  }

  ngOnInit() {
    this.appState.getModulesForUser('cko')
    this.appState.getBranchForUser(this.username)
    this.appState.getEditMode()
    this.editMode && this.appState.getModuleDrafts()
    this.editMode && this.appState.getValidationResult()
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe())
  }

  // Branch

  editBranch = (e: Either<undefined, UserBranch>) => {
    fold(
      e,
      () => {
        this.appState.setEditMode(true)
        this.appState.getModuleDrafts()
        this.appState.getValidationResult()
      },
      () => {
        this.appState.createBranchForUser(
          this.username,
          branch => {
            if (branch.value) {
              this.appState.setEditMode(true)
              this.appState.getModuleDrafts()
              this.appState.getValidationResult()
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

  show = ([m,]: [Module, ModuleDraft | undefined]) =>
    this.router.navigate(['/show'], {state: {id: m.id}})

  onCreate = () =>
    this.router.navigate(['/edit'], {queryParams: {action: 'create'}})

  // Validation

  validateAllChanges = () => {
    this.appState.forceValidation()
  }

  // Review

  reviewAllChanges = () => {
    this.appState.forceReview(this.username)
  }

  alreadyReviewed = () =>
    this.appState.alreadyReviewed()

  canReview = () =>
    this.appState.canReview() && !this.alreadyReviewed()

  revertReview = () => {
    this.appState.forceRevertReview(this.username)
  }

  // Table

  tableContent = ([module, draft]: [Module, ModuleDraft | undefined], attr: string): string => {
    if (attr !== 'name') {
      return '???'
    }
    let str = draft ? draft.data.metadata.title : module.title
    if (draft) {
      str += ` (${draft.status})`
    }
    return str
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

  validationErrors = (res: ValidationResult): ReadonlyArray<PipelineError> | null =>
    res.data
}
