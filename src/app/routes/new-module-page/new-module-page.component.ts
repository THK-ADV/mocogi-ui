import { Component, OnInit } from '@angular/core'
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
import { selectUpdateInProcess } from '../../state/selectors/new-module.selector'

@Component({
  selector: 'cops-new-module-page',
  templateUrl: './new-module-page.component.html',
  styleUrls: ['./new-module-page.component.css'],
})
export class NewModulePageComponent implements OnInit {
  moduleForm?: ModuleForm<unknown, unknown>
  formGroup = new FormGroup({})
  updateInProcess$ = this.store.select(selectUpdateInProcess)

  constructor(private store: Store, private http: HttpService, private dialog: MatDialog) {
    zip([
      http.allModules(),
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

  ngOnInit() {
    this.store.dispatch(NewModulePageActions.enter())
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
