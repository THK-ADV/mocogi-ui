import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { toPOPreview } from 'src/app/create-or-update-module/create-or-update-module.component'
import { inputs } from 'src/app/create-or-update-module/inputs/inputs'
import { ModuleForm, ModuleFormComponent } from 'src/app/form/module-form/module-form.component'
import { HttpService } from 'src/app/http/http.service'
import { throwError } from 'src/app/types/error'
import { zip } from 'rxjs'
import { Module } from '../../types/moduleCore'
import { Store } from '@ngrx/store'
import { UpdateModulePageActions } from '../../state/actions/update-module-page.actions'
import { buildChangeLog } from '../../components/list-of-changes/list-of-changes.helpers'
import { ChangeLogItem } from '../../types/changes'
import { Approval } from '../../types/approval'

@Component({
  selector: 'cops-update-module-page',
  templateUrl: './update-module-page.component.html',
  styleUrls: ['./update-module-page.component.css'],
})
export class UpdateModulePageComponent {
  @ViewChild('moduleFormComponent') moduleFormComponent?: ModuleFormComponent<unknown, unknown>

  moduleId: string
  moduleForm?: ModuleForm<unknown, unknown>
  modifiedKeys: Array<ChangeLogItem> = []
  approvals: ReadonlyArray<Approval> =  []
  stagingModuleCompendium?: Module

  cancel = () => {
    this.store.dispatch(UpdateModulePageActions.cancel())
  }

  save = () => {
    const moduleCompendiumProtocol = this.moduleFormComponent?.moduleCompendiumProtocol()
    if(moduleCompendiumProtocol) {
      this.store.dispatch(UpdateModulePageActions.save({ moduleId: this.moduleId, moduleCompendiumProtocol }))
    }
  }

  constructor(private route: ActivatedRoute, http: HttpService, dialog: MatDialog, private store: Store) {
    this.moduleId = this.route.snapshot.paramMap.get('moduleId') ?? throwError('Module ID should be in route parameters.')
    zip([
      http.latestModuleDescriptionById(this.moduleId),
      http.stagingModuleDescriptionById(this.moduleId),
      http.moduleDraftKeys(this.moduleId),
      http.getApprovals(this.moduleId),
      http.allModules(),
      http.allModuleTypes(),
      http.allSeasons(),
      http.allLanguages(),
      http.allLocations(),
      http.allStatus(),
      http.allIdentities(),
      http.allAssessmentMethods(),
      http.allValidPOs(),
      http.allCompetences(),
      http.allGlobalCriteria(),
      http.allStudyPrograms(),
      http.allDegrees(),
    ]).subscribe(([
      moduleCompendium,
      stagingModuleCompendium,
      moduleDraftKeys,
      approvals,
      modules,
      moduleTypes,
      seasons,
      languages,
      locations,
      status,
      persons,
      assessmentMethods,
      pos,
      competencies,
      globalCriteria,
      studyPrograms,
      degrees,
    ]) => {
      console.log(moduleCompendium.metadata.po)
      console.log(pos)
      console.log(studyPrograms)
      const poPreviews = toPOPreview(pos, studyPrograms, degrees)
      this.moduleForm = {
        objectName: moduleCompendium.metadata.title,
        editType: 'update',
        sections: inputs(
          modules,
          moduleTypes,
          languages,
          seasons,
          locations,
          status,
          persons,
          assessmentMethods,
          [...poPreviews],
          competencies,
          globalCriteria,
          dialog,
          (attr) => this.moduleFormComponent?.formControl(attr).value,
          moduleCompendium,
          moduleCompendium.id,
        ),
      }
      this.modifiedKeys = buildChangeLog(moduleDraftKeys, moduleCompendium, stagingModuleCompendium)
      this.approvals = approvals
    })
  }
}
