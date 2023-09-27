import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ModuleForm } from 'src/app/form/module-form/module-form.component'
import { HttpService } from 'src/app/http/http.service'


@Component({
  selector: 'cops-update-module-page',
  templateUrl: './update-module-page.component.html',
  styleUrls: ['./update-module-page.component.css'],
})
export class UpdateModulePageComponent {
  id: string | null = null
  moduleForm?: ModuleForm<unknown, unknown>

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

  constructor(private route: ActivatedRoute, private http: HttpService) {
    this.id = this.route.snapshot.paramMap.get('id')
    if (this.id) {
      this.http.moduleCompendiumById(this.id).subscribe((moduleCompendium) => {
        this.moduleForm = {
          objectName: moduleCompendium.metadata.title,
          editType: 'update',
          sections: [
            {
              header: 'Andere Daten',
              rows: {
                'title': [
                  {
                    language: 'de',
                    input: {
                      kind: 'text',
                      label: 'Modulbezeichnung',
                      attr: 'title-de',
                      disabled: false,
                      required: true,
                      initialValue: moduleCompendium.metadata?.title,
                    },
                  },
                  {
                    language: 'en',
                    input: {
                      kind: 'text',
                      label: 'Module Name',
                      attr: 'title-en',
                      disabled: false,
                      required: true,
                      initialValue: moduleCompendium.metadata?.title,
                    },
                  },
                ],
                'title2': [
                  {
                    language: 'de',
                    input: {
                      kind: 'text',
                      label: 'Modulbezeichnung',
                      attr: 'title-de2',
                      disabled: false,
                      required: true,
                      initialValue: moduleCompendium.metadata?.title,
                    },
                  },
                  {
                    language: 'en',
                    input: {
                      kind: 'text',
                      label: 'Module Name',
                      attr: 'title-en2',
                      disabled: false,
                      required: true,
                      initialValue: moduleCompendium.metadata?.title,
                    },
                  },
                ],
              },
            },
            {
              header: 'Stammdaten',
              rows: {
                'abbrev': [
                  {
                    input: {
                      kind: 'text',
                      label: 'Modulabkürzung',
                      attr: 'abbrev',
                      disabled: false,
                      required: true,
                      initialValue: moduleCompendium.metadata?.abbrev,
                    },
                  },
                ],
                'lang': [
                  {
                    input: {
                      kind: 'text',
                      label: 'Sprache',
                      attr: 'lang',
                      disabled: false,
                      required: true,
                      initialValue: moduleCompendium.metadata?.language,
                    },
                  },
                ],
              },
            },
          ],
        }
      })
    }
  }
}
