import { Component } from '@angular/core'
import { ModuleProtocol } from '../../types/moduleCore'
import { Store } from '@ngrx/store'
import { inputs } from '../../create-or-update-module/inputs/inputs'
import { ModuleForm } from '../../form/module-form/module-form.component'
import { zip } from 'rxjs'
import { HttpService } from '../../http/http.service'
import { MatDialog } from '@angular/material/dialog'
import { parseModuleCompendium } from '../../types/metadata-protocol-factory'
import { NewModulePageActions } from '../../state/actions/new-module-page.actions'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'cops-new-module-page',
  templateUrl: './new-module-page.component.html',
  styleUrls: ['./new-module-page.component.css'],
})
export class NewModulePageComponent {
  moduleForm?: ModuleForm<unknown, unknown>
  formGroup = new FormGroup({})

  constructor(private store: Store, private http: HttpService, private dialog: MatDialog) {
    zip([
      http.allModules(),
      http.allGenericModules(),
      http.allModuleTypes(),
      http.allSeasons(),
      http.allLanguages(),
      http.allLocations(),
      http.allStatus(),
      http.allIdentities(),
      http.allAssessmentMethods(),
      http.allCompetences(),
      http.allGlobalCriteria(),
      http.allStudyPrograms(),
    ]).subscribe(([
                    modules,
                    genericModules,
                    moduleTypes,
                    seasons,
                    languages,
                    locations,
                    status,
                    persons,
                    assessmentMethods,
                    competencies,
                    globalCriteria,
                    studyPrograms,
                  ]) => {
      this.moduleForm = {
        objectName: 'New Module',
        editType: 'create',
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
          competencies,
          globalCriteria,
          dialog,
          (attr) => this.formGroup.get(attr)?.value,
        ),
      }
    })
  }

  isValid = () =>
    this.formGroup.valid ?? false

  cancel = () => {
    this.store.dispatch(NewModulePageActions.cancel())
  }

  save = () => {
    const moduleCompendiumProtocol = parseModuleCompendium(this.formGroup)
    moduleCompendiumProtocol && this.submit(moduleCompendiumProtocol)
  }

  submit = (moduleCompendiumProtocol: ModuleProtocol) => {
    this.store.dispatch(NewModulePageActions.save({moduleCompendiumProtocol}))
  }
}
