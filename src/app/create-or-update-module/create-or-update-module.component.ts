import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
import { HttpService, Language, Metadata, ModuleType, Person, Season } from '../http/http.service'
import { forkJoin, of, Subscription } from 'rxjs'
import { EditModulePayload } from '../form/edit-module/edit-module.component'
import { NumberInput, TextInput } from '../form/plain-input/plain-input.component'
import { OptionsInput } from '../form/options-input/options-input.component'
import { MultipleOptionsInput } from '../form/multiple-options-input/multiple-options-input.component'

@Component({
  selector: 'sched-create-or-update-module',
  templateUrl: './create-or-update-module.component.html',
  styleUrls: ['./create-or-update-module.component.css']
})
export class CreateOrUpdateModuleComponent implements OnInit, OnDestroy {

  payload?: EditModulePayload

  private readonly id?: string
  private readonly action: string | null
  private sub?: Subscription

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpService
  ) {
    this.id = this.router.getCurrentNavigation()?.extras?.state?.['id']
    this.action = this.route.snapshot.queryParamMap.get('action')
  }

  ngOnInit(): void {
    if (this.action === 'update' && this.id === undefined) {
      this.goBack()
    } else {
      this.sub = forkJoin([
        this.http.allCoreData(),
        this.id ? this.http.metadataById(this.id) : of(undefined)
      ]).subscribe(xs => {
        const coreData = xs[0]
        const metadata = xs[1]
        this.payload = {
          objectName: metadata?.title ?? 'Neues Modul',
          editType: this.action == 'create' ? 'create' : 'update',
          inputs: [
            // this.titleInput(metadata),
            // this.abbreviationInput(metadata),
            // this.moduleTypesInput(metadata),
            // this.creditsInput(metadata),
            // this.languagesInput(metadata),
            // this.durationInput(metadata),
            // this.frequencyInput(metadata),
            // this.moduleCoordinatorInput(metadata),
            this.lecturerInput(metadata),
          ]
        }
      })
    }
  }

  private titleInput = (metadata?: Metadata): TextInput =>
    ({
      kind: 'text',
      label: 'Modulbezeichnung',
      attr: 'title',
      disabled: false,
      required: true,
      initialValue: metadata?.title
    })

  private abbreviationInput = (metadata?: Metadata): TextInput =>
    ({
      kind: 'text',
      label: 'Modulabkürzung',
      attr: 'abbreviation',
      disabled: false,
      required: true,
      initialValue: metadata?.abbrev
    })

  private moduleTypesInput = (metadata?: Metadata): OptionsInput<ModuleType> =>
    ({
      kind: 'options',
      label: 'Art des Moduls',
      attr: 'moduleType',
      disabled: false,
      required: true,
      data: this.http.allModuleTypes(),
      show: a => a.deLabel,
      initialValue: metadata && (as => as.find(a => a.abbrev === metadata.moduleType))
    })

  private creditsInput = (metadata?: Metadata): NumberInput =>
    ({
      kind: 'number',
      label: 'ECTS credits',
      attr: 'ects',
      disabled: false,
      required: true,
      initialValue: metadata?.ects,
      min: 1
    })

  private languagesInput = (metadata?: Metadata): OptionsInput<Language> =>
    ({
      kind: 'options',
      label: 'Sprache',
      attr: 'language',
      disabled: false,
      required: true,
      data: this.http.allLanguages(),
      show: a => a.deLabel,
      initialValue: metadata && (as => as.find(a => a.abbrev === metadata.language))
    })

  private durationInput = (metadata?: Metadata): NumberInput =>
    ({
      kind: 'number',
      label: 'Dauer des Moduls',
      attr: 'duration',
      disabled: false,
      required: true,
      initialValue: metadata?.duration,
      min: 1
    })

  private frequencyInput = (metadata?: Metadata): OptionsInput<Season> =>
    ({
      kind: 'options',
      label: 'Häufigkeit des Angebots',
      attr: 'season',
      disabled: false,
      required: true,
      data: this.http.allSeasons(),
      show: a => a.deLabel,
      initialValue: metadata && (as => as.find(a => a.abbrev === metadata.season))
    })

  private moduleCoordinatorInput = (metadata?: Metadata): OptionsInput<Person> =>
    ({
      kind: 'options',
      label: 'Modulverantwortliche*r',
      attr: 'moduleCoordinator',
      disabled: false,
      required: true,
      data: this.http.allPersons(),
      show: this.showPerson,
      initialValue: metadata && (as => as.find(a => metadata.moduleManagement.some(m => m === a.id)))
    })


  private lecturerInput = (metadata?: Metadata): MultipleOptionsInput<Person> =>
    ({
      kind: 'multiple-options',
      label: 'Dozierende',
      attr: 'lecturer',
      disabled: false,
      required: true,
      data: this.http.allPersons(),
      show: this.showPerson,
      initialValue: metadata && (as => as.filter(a => metadata.lecturers.some(m => m === a.id)))
    })

  private showPerson = (p: Person): string => {
    switch (p.kind) {
      case 'single':
        return `${p.lastname}, ${p.firstname}`
      case 'group':
        return p.title
      case 'unknown':
        return p.title
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  goBack = (): void =>
    this.location.back()

  onSubmit = (any: any) => {
    console.log(any)
    // const go = (array: any, depth: number) => {
    //   for (const k in array) {
    //     const v = array[k]
    //     if (Array.isArray(v)) {
    //       go(v, depth + 1)
    //     } else {
    //       const ws = ' '.repeat(depth * 3)
    //       console.log(ws, k, v)
    //     }
    //   }
    // }
    // go(any, 0)
  }
}
