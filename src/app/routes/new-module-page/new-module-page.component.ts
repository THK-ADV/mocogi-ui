import { Component, ViewChild } from '@angular/core'
import { ModuleCompendiumProtocol } from '../../types/module-compendium'
import { Store } from '@ngrx/store'
import { inputs } from '../../create-or-update-module/inputs/inputs'
import { ModuleForm, ModuleFormComponent } from '../../form/module-form/module-form.component'
import { zip } from 'rxjs'
import { toPOPreview } from '../../create-or-update-module/create-or-update-module.component'
import { HttpService } from '../../http/http.service'
import { MatDialog } from '@angular/material/dialog'
import { parseModuleCompendium } from '../../types/metadata-protocol-factory'

@Component({
  selector: 'cops-new-module-page',
  templateUrl: './new-module-page.component.html',
  styleUrls: ['./new-module-page.component.css'],
})
export class NewModulePageComponent {
  moduleForm?: ModuleForm<unknown, unknown>

  @ViewChild('moduleFormComponent') moduleFormComponent?: ModuleFormComponent<unknown, unknown>
  constructor(private store: Store, private http: HttpService, private dialog: MatDialog) {
    zip([
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
        objectName: 'New Module',
        editType: 'create',
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
        ),
      }
    })
  }

  cancel() {
    return
  }

  onSave() {
    const moduleCompendiumProtocol = parseModuleCompendium(this.moduleFormComponent?.formGroup.value)
    this.submit(moduleCompendiumProtocol)
  }

  submit = (moduleCompendiumProtocol: ModuleCompendiumProtocol) => {
    console.log(moduleCompendiumProtocol)
    // this.store.dispatch(NewModulePageActions.save({ moduleCompendiumProtocol }))
  }
}
