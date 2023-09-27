import { Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { toPOPreview } from 'src/app/create-or-update-module/create-or-update-module.component'
import { inputs } from 'src/app/create-or-update-module/inputs/inputs'
import { ModuleForm, ModuleFormComponent } from 'src/app/form/module-form/module-form.component'
import { HttpService } from 'src/app/http/http.service'
import { throwError } from 'src/app/types/error'


@Component({
  selector: 'cops-update-module-page',
  templateUrl: './update-module-page.component.html',
  styleUrls: ['./update-module-page.component.css'],
})
export class UpdateModulePageComponent {
  id: string | null = null
  moduleForm?: ModuleForm<unknown, unknown>

  @ViewChild('moduleFormComponent') moduleFormComponent!: ModuleFormComponent<unknown, unknown>


  // versions = [
  //   {title: 'Current changes', index: 6, status: 'draft'},
  //   {title: '22.06.2023', index: 5, status: 'currently published'},
  //   {title: '01.03.2023', index: 4, status: 'past'},
  //   {title: '11.02.2022', index: 3, status: 'past'},
  //   {title: '10.02.2021', index: 2, status: 'past'},
  //   {title: '03.03.2021', index: 1, status: 'past'},
  // ]

  cancel() {
    return
  }

  submit(value: unknown, dirtyKeys: string[]) {
    console.log(value, dirtyKeys)
    return
  }

  constructor(private route: ActivatedRoute, private http: HttpService, private dialog: MatDialog) {
    this.id = this.route.snapshot.paramMap.get('id') ?? throwError('ID should be in route parameters.')
    zip([
      http.moduleCompendiumById(this.id),
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
          seasons,
          languages,
          locations,
          status,
          persons,
          assessmentMethods,
          [...poPreviews],
          competencies,
          globalCriteria,
          dialog,
          (attr) => this.moduleFormComponent.formControl(attr).value,
          moduleCompendium,
          moduleCompendium.metadata.id,
        ),
      }
    })
  }
}
