import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { toPOPreview } from 'src/app/create-or-update-module/create-or-update-module.component'
import { inputs } from 'src/app/create-or-update-module/inputs/inputs'
import { ModuleForm, ModuleFormComponent } from 'src/app/form/module-form/module-form.component'
import { HttpService } from 'src/app/http/http.service'
import { throwError } from 'src/app/types/error'
import { zip } from 'rxjs'
import { ModuleCompendiumProtocol } from '../../types/module-compendium'
import { Store } from '@ngrx/store'
import { UpdateModulePageActions } from '../../state/actions/update-module-page.actions'

@Component({
  selector: 'cops-update-module-page',
  templateUrl: './update-module-page.component.html',
  styleUrls: ['./update-module-page.component.css'],
})
export class UpdateModulePageComponent {
  moduleId: string
  moduleForm?: ModuleForm<unknown, unknown>

  @ViewChild('moduleFormComponent') moduleFormComponent?: ModuleFormComponent<unknown, unknown>

  cancel() {
    return
  }

  submit = (moduleCompendiumProtocol: ModuleCompendiumProtocol, dirtyKeys: string[]) => {
    console.log(moduleCompendiumProtocol, dirtyKeys, this.moduleId)
   this.store.dispatch(UpdateModulePageActions.save({ moduleId: this.moduleId, moduleCompendiumProtocol, dirtyKeys }))
  }

  constructor(private route: ActivatedRoute, private http: HttpService, private dialog: MatDialog, private store: Store) {
    this.moduleId = this.route.snapshot.paramMap.get('moduleId') ?? throwError('Module ID should be in route parameters.')
    zip([
      http.latestModuleCompendiumById(this.moduleId),
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
    })
  }
}
