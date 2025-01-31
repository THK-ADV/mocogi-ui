import { Component, OnInit } from '@angular/core'
import { ModuleProtocol } from '../../types/moduleCore'
import { Store } from '@ngrx/store'
import { inputs } from '../../create-or-update-module/inputs/inputs'
import { ModuleForm } from '../../form/module-form/module-form.component'
import { forkJoin } from 'rxjs'
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
  standalone: false,
})
export class NewModulePageComponent implements OnInit {
  moduleForm?: ModuleForm<unknown, unknown>
  formGroup = new FormGroup({})
  updateInProcess$ = this.store.select(selectUpdateInProcess)

  constructor(
    private store: Store,
    private http: HttpService,
    private dialog: MatDialog,
  ) {
    forkJoin([
      http.allModules(),
      http.allGenericModules(),
      http.allModuleTypes(),
      http.allSeasons(),
      http.allLanguages(),
      http.allLocations(),
      http.allStatus(),
      http.allIdentities(),
      http.allValidAssessmentMethods(),
      http.allCompetences(),
      http.allGlobalCriteria(),
      http.allStudyPrograms(),
      http.allExamPhases(),
    ]).subscribe(
      ([
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
        examPhases,
      ]) => {
        this.moduleForm = {
          objectName: $localize`Neues Modul`,
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
            examPhases,
            dialog,
            (attr) => this.formGroup.get(attr)?.value,
          ),
        }
      },
    )
  }

  ngOnInit() {
    this.store.dispatch(NewModulePageActions.enter())
  }

  isValid = () => this.formGroup.valid ?? false

  cancel = () => {
    this.store.dispatch(NewModulePageActions.cancel())
  }

  save = () => {
    const moduleCompendiumProtocol = parseModuleCompendium(this.formGroup)
    if (moduleCompendiumProtocol) {
      this.submit(moduleCompendiumProtocol)
    }
  }

  submit = (moduleCompendiumProtocol: ModuleProtocol) => {
    this.store.dispatch(NewModulePageActions.save({ moduleCompendiumProtocol }))
  }
}
