import { Component, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpService } from '../../http/http.service'
import { MatDialog } from '@angular/material/dialog'
import { throwError } from '../../types/error'
import { zip } from 'rxjs'
import { toPOPreview } from '../../create-or-update-module/create-or-update-module.component'
import { inputs } from '../../create-or-update-module/inputs/inputs'
import { ModuleForm, ModuleFormComponent } from '../../form/module-form/module-form.component'
import { buildChangeLog } from '../../components/list-of-changes/list-of-changes.helpers'
import { ChangeLogItem } from '../../types/changes'

@Component({
  selector: 'cops-module-review-page',
  templateUrl: './module-approval-page.component.html',
  styleUrls: ['./module-approval-page.component.css'],
})
export class ModuleApprovalPageComponent {
  @ViewChild('moduleFormComponent') moduleFormComponent?: ModuleFormComponent<unknown, unknown>

  moduleId: string
  moduleForm?: ModuleForm<unknown, unknown>
  modifiedKeys: Array<ChangeLogItem> = []
  
  constructor(private route: ActivatedRoute, private http: HttpService, private dialog: MatDialog) {
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
          [ ...poPreviews ],
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

  protected readonly onsubmit = () => {
    console.log('PING')
  }

  protected readonly oncancel = () => {
    console.log('PONG')
  }

}
