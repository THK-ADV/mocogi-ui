import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpService } from '../../http/http.service'
import { MatDialog } from '@angular/material/dialog'
import { throwError } from '../../types/error'
import { forkJoin } from 'rxjs'
import { inputs } from '../../create-or-update-module/inputs/inputs'
import { ModuleForm } from '../../form/module-form/module-form.component'
import { buildChangeLog } from '../../components/list-of-changes/list-of-changes.helpers'
import { ChangeLogItem } from '../../types/changes'
import { Store } from '@ngrx/store'
import { ModuleApprovalPageActions } from '../../state/actions/module-approval-page.actions'
import { Approval } from '../../types/approval'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'cops-module-review-page',
  templateUrl: './module-approval-page.component.html',
  styleUrls: ['./module-approval-page.component.css'],
  standalone: false,
})
export class ModuleApprovalPageComponent {
  moduleId: string
  approvalId: string
  moduleForm?: ModuleForm<unknown, unknown>
  modifiedKeys: Array<ChangeLogItem> = []
  approvals: ReadonlyArray<Approval> = []
  formGroup = new FormGroup({})
  mergeRequestUrl?: string

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private dialog: MatDialog,
    private store: Store,
  ) {
    this.moduleId =
      this.route.snapshot.paramMap.get('moduleId') ??
      throwError('Module ID should be in route parameters.')
    this.approvalId =
      this.route.snapshot.paramMap.get('approvalId') ??
      throwError('Module ID should be in route parameters.')
    forkJoin([
      http.latestModuleDescriptionById(this.moduleId),
      http.stagingModuleDescriptionById(this.moduleId),
      http.moduleDraftKeys(this.moduleId),
      http.getApprovals(this.moduleId),
      http.allModules(),
      http.allGenericModules(),
      http.allModuleTypes(),
      http.allSeasons(),
      http.allLanguages(),
      http.allLocations(),
      http.allStatus(),
      http.allIdentities(),
      http.allAssessmentMethods(),
      http.allStudyPrograms(),
      http.allExamPhases(),
      http.mergeRequestUrl(this.moduleId),
    ]).subscribe(
      ([
        moduleCompendium,
        stagingModuleCompendium,
        moduleDraftKeys,
        approvals,
        modules,
        genericModules,
        moduleTypes,
        seasons,
        languages,
        locations,
        status,
        persons,
        assessmentMethods,
        studyPrograms,
        examPhases,
        mrUrl,
      ]) => {
        this.moduleForm = {
          objectName: moduleCompendium.metadata.title,
          editType: 'update',
          sections: inputs(
            modules,
            genericModules,
            moduleTypes,
            languages,
            seasons,
            locations,
            status,
            persons,
            assessmentMethods,
            [...studyPrograms],
            examPhases,
            dialog,
            (attr) => this.formGroup.get(attr)?.value,
            moduleCompendium,
            moduleCompendium.id,
          ),
        }
        this.modifiedKeys = buildChangeLog(
          moduleDraftKeys,
          moduleCompendium,
          stagingModuleCompendium,
        )
        this.approvals = approvals
        this.mergeRequestUrl = mrUrl
      },
    )
  }

  protected approve = (comment?: string) => {
    this.store.dispatch(
      ModuleApprovalPageActions.approve({
        moduleId: this.moduleId,
        approvalId: this.approvalId,
        comment: comment,
      }),
    )
  }

  protected reject = (comment?: string) => {
    this.store.dispatch(
      ModuleApprovalPageActions.reject({
        moduleId: this.moduleId,
        approvalId: this.approvalId,
        comment: comment,
      }),
    )
  }

  protected cancel = () => {}

  protected openUrl = (url: string) => window.open(url)
}
