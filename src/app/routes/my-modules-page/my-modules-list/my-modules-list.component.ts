import { Component, Input } from '@angular/core'
import { Store } from '@ngrx/store'
import { MatTableDataSource } from '@angular/material/table'
import { SelectionModel } from '@angular/cdk/collections'
import { ModuleCore } from '../../../types/moduleCore'
import { MyModulesPageActions } from '../../../state/actions/my-modules.action'
import { ModeratedModule } from '../../../types/moderated.module'
import { MatDialog } from '@angular/material/dialog'
import { PermissionsDialogComponent } from '../../../components/permissions-dialog/permissions-dialog.component'

@Component({
  selector: 'cops-my-modules-list',
  templateUrl: './my-modules-list.component.html',
  styleUrls: ['./my-modules-list.component.css'],
})
export class MyModulesListComponent {

  protected dataSource = new MatTableDataSource<ModeratedModule>()
  protected displayedColumns: string[] = ['module', 'status', 'actions']
  protected selection = new SelectionModel<ModuleCore>(true, [])

  @Input() set modules(xs: ReadonlyArray<ModeratedModule> | null) {
    if (xs) {
      this.dataSource.data = [...xs]
    }
  }

  constructor(private readonly store: Store, private dialog: MatDialog) {
  }

  showLatestModule(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.showLatestModule({moduleId}))
  }

  editModule(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.editModule({moduleId}))
  }

  publishModule(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.publishModule({moduleId}))
  }

  requestReview(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.requestReview({moduleId}))
  }

  cancelReview(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.cancelReview({moduleId}))
  }

  discardChanges(moduleId: string) {
    this.store.dispatch(MyModulesPageActions.discardChanges({moduleId}))
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
    switch (moduleDraft.source) {
      case 'added':
        return '#309656'
      case 'modified':
        return '#bd4c1a'
    }
  }

  status = ({moduleDraftState}: ModeratedModule) =>
    moduleDraftState.deLabel

  canEdit = ({moduleDraftState}: ModeratedModule) =>
    moduleDraftState.id === 'valid_for_review' ||
    moduleDraftState.id === 'valid_for_publication' ||
    moduleDraftState.id === 'published' ||
    moduleDraftState.id === 'waiting_for_changes'

  canPublish = ({moduleDraftState}: ModeratedModule) =>
    moduleDraftState.id === 'valid_for_publication'

  canRequestReview = ({moduleDraftState}: ModeratedModule) =>
    moduleDraftState.id === 'valid_for_review'

  canCancelReview = ({moduleDraftState}: ModeratedModule) =>
    moduleDraftState.id === 'waiting_for_review'

  canDiscardChanges = ({moduleDraftState}: ModeratedModule) =>
    moduleDraftState.id === 'valid_for_review' ||
    moduleDraftState.id === 'valid_for_publication' ||
    moduleDraftState.id === 'waiting_for_changes'

  tooltip = ({moduleDraftState}: ModeratedModule) => {
    switch (moduleDraftState.id) {
      case 'published':
        return $localize`Das Modul ist veröffentlicht und taucht im Modulhandbuch und in der Modulsuche auf.`
      case 'valid_for_review':
        return $localize`Das Modul kann zur Genehmigung freigegeben werden. Eine Genehmigung ist erforderlich, da genehmigungspflichtige Attribute geändert wurden.`
      case 'valid_for_publication':
        return $localize`Das Modul kann veröffentlicht werden. Nach der Bearbeitungsphase taucht es im Modulhandbuch und in der Modulsuche auf.`
      case 'waiting_for_review':
        return $localize`Das Modul ist im Genehmigungsprozess.`
      case 'waiting_for_changes':
        return $localize`Das Modul wurde im Genehmigungsprozess abgelehnt und benötigt Anpassungen.`
      case 'unknown':
        return $localize`Unbekannt.`
    }
  }

  openDialog = (module: ModuleCore) => {
    this.dialog.open(PermissionsDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {moduleId: module.id, moduleTitle: module.title},
    })
  }
}
