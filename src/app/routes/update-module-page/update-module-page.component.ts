import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { toPOPreview } from 'src/app/create-or-update-module/create-or-update-module.component'
import { inputs } from 'src/app/create-or-update-module/inputs/inputs'
import { ModuleForm, ModuleFormComponent } from 'src/app/form/module-form/module-form.component'
import { HttpService } from 'src/app/http/http.service'
import { throwError } from 'src/app/types/error'
import { zip } from 'rxjs'
import { ModuleCompendium, ModuleCompendiumProtocol } from '../../types/module-compendium'
import { Store } from '@ngrx/store'
import { UpdateModulePageActions } from '../../state/actions/update-module-page.actions'
import { buildChangeLog } from '../../components/list-of-changes/list-of-changes.helpers'
import { ChangeLogItem } from '../../types/changes'

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
  stagingModuleCompendium?: ModuleCompendium

  cancel() {
    return
  }

  save = () => {
    const moduleCompendiumProtocol = this.moduleFormComponent?.moduleCompendiumProtocol()
    if(moduleCompendiumProtocol) {
      this.store.dispatch(UpdateModulePageActions.save({ moduleId: this.moduleId, moduleCompendiumProtocol }))
    }
  }

  submit = (moduleCompendiumProtocol: ModuleCompendiumProtocol) => {
   this.store.dispatch(UpdateModulePageActions.save({ moduleId: this.moduleId, moduleCompendiumProtocol }))
  }

  constructor(private route: ActivatedRoute, http: HttpService, dialog: MatDialog, private store: Store) {
    this.moduleId = this.route.snapshot.paramMap.get('moduleId') ?? throwError('Module ID should be in route parameters.')
    zip([
      http.latestModuleCompendiumById(this.moduleId),
      http.stagingModuleCompendiumById(this.moduleId),
      http.moduleDraftKeys(this.moduleId),
      http.allModules(),
      http.allModuleTypes(),
      http.allSeasons(),
      http.allLanguages(),
      http.allLocations(),
      http.allStatus(),
      http.allPersons(),
      http.allAssessmentMethods(),
      http.allValidPOs(),
      http.allCompetences(),
      http.allGlobalCriteria(),
      http.allStudyPrograms(),
      http.allGrades(),
    ]).subscribe(([
      moduleCompendium,
      stagingModuleCompendium,
      moduleDraftKeys,
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
      grades,
    ]) => {
      const poPreviews = toPOPreview(pos, studyPrograms, grades)
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
          moduleCompendium.metadata.id,
        ),
      }
      this.modifiedKeys = buildChangeLog(moduleDraftKeys, moduleCompendium, stagingModuleCompendium)
    })
  }
}
