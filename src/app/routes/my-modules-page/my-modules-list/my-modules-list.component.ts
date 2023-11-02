import { Component, Input } from '@angular/core'
import { Store } from '@ngrx/store'
import { MatTableDataSource } from '@angular/material/table'
import { SelectionModel } from '@angular/cdk/collections'
import { Module } from '../../../types/module'
import { MyModulesPageActions } from '../../../state/actions/my-modules.action'
import { ModeratedModule, ModuleStatus } from '../../../types/moderated.module'

@Component({
  selector: 'cops-my-modules-list',
  templateUrl: './my-modules-list.component.html',
  styleUrls: ['./my-modules-list.component.css'],
})
export class MyModulesListComponent {

  protected dataSource = new MatTableDataSource<ModeratedModule>()
  protected displayedColumns: string[] = ['module', 'status', 'actions']
  protected selection = new SelectionModel<Module>(true, [])

  @Input() set modules(xs: ReadonlyArray<ModeratedModule> | null) {
    if (xs) {
      this.dataSource.data = [...xs]
    }
  }

  constructor(private readonly store: Store) {

  }

  showModule(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.showModule({ moduleId }))
  }

  editModule(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.editModule({ moduleId }))
  }

  publishModule(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.publishModule({ moduleId }))
  }

  requestReview(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.requestReview({ moduleId }))
  }

  cancelReview(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.cancelReview({ moduleId }))
  }

  discardChanges(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.discardChanges({ moduleId }))
  }

  title = ({module, moduleDraft}: ModeratedModule): string => {
    if (moduleDraft) {
      return `${moduleDraft.data.metadata.title} (${moduleDraft.data.metadata.abbrev})`
    } else {
      return `${module.title} (${module.abbrev})`
    }
  }

  tableColor = ({moduleDraft}: ModeratedModule) => {
    if (!moduleDraft) {
      return '#000000'
    }
    switch (moduleDraft.status) {
      case 'added':
        return '#309656'
      case 'modified':
        return '#bd4c1a'
    }
  }

  status = ({status}: ModeratedModule) => {
    return status.deLabel
  }

  canEdit = (status: ModuleStatus) =>
    status.id === 'valid_for_review' ||
    status.id === 'valid_for_publication' ||
    status.id === 'published'

  canPublish = (status: ModuleStatus) =>
    status.id === 'valid_for_publication'

  canRequestReview = (status: ModuleStatus) =>
    status.id === 'valid_for_review'

  canStopPublication = (status: ModuleStatus) =>
    status.id === 'waiting_for_approval'

  canDiscardChanges = ({moduleDraft, status}: ModeratedModule) =>
    moduleDraft?.modifiedKeys?.length !== 0 && (status.id === 'valid_for_review' || status.id === 'valid_for_publication')
}
