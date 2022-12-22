import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location as AngularLocation } from '@angular/common'
import { AssessmentMethod, HttpService, Language, Location, Metadata, ModuleType, Person, Season, Status } from '../http/http.service'
import { forkJoin, of, Subscription } from 'rxjs'
import { EditModulePayload } from '../form/edit-module/edit-module.component'
import { NumberInput, TextInput } from '../form/plain-input/plain-input.component'
import { OptionsInput } from '../form/options-input/options-input.component'
import { MultipleOptionsInput } from '../form/multiple-options-input/multiple-options-input.component'
import { ReadOnlyInput } from '../form/read-only-input/read-only-input.component'
import { AssessmentMethodDialogComponent } from '../form/assessment-method-dialog/assessment-method-dialog.component'
import { MatDialog } from '@angular/material/dialog'

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
    private location: AngularLocation,
    private http: HttpService,
    private dialog: MatDialog
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
        const [locations, languages, status, assessmentMethods, moduleTypes, seasons, persons, studyFormTypes] = xs[0]
        const metadata = xs[1]
        this.payload = {
          objectName: metadata?.title ?? 'Neues Modul',
          editType: this.action == 'create' ? 'create' : 'update',
          inputs: [
            this.generalInformation(moduleTypes, languages, seasons, locations, status, metadata),
            this.responsibilities(persons, metadata),
            this.assessmentMethods(assessmentMethods, metadata)
          ]
        }
      })
    }
  }

  private generalInformation = (
    moduleTypes: ModuleType[],
    languages: Language[],
    seasons: Season[],
    locations: Location[],
    status: Status[],
    metadata?: Metadata
  ) => ({
    header: 'Allgemeine Informationen',
    value: [
      this.titleInput(metadata),
      this.abbreviationInput(metadata),
      this.moduleTypesInput(moduleTypes, metadata),
      this.creditsInput(metadata),
      this.languagesInput(languages, metadata),
      this.durationInput(metadata),
      this.frequencyInput(seasons, metadata),
      this.locationsInput(locations, metadata),
      this.statusInput(status, metadata)
    ]
  })

  private responsibilities = (persons: Person[], metadata?: Metadata) =>
    ({
      header: 'Verantwortliche',
      value: [
        this.moduleCoordinatorInput(persons, metadata),
        this.lecturerInput(persons, metadata),
      ]
    })

  private assessmentMethods = (assessmentMethods: AssessmentMethod[], metadata?: Metadata) =>
    ({
      header: 'Prüfungsformen',
      value: [
        this.assessmentMethodsInput(assessmentMethods, metadata)
      ]
    })

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

  private moduleTypesInput = (modulesTypes: ModuleType[], metadata?: Metadata): OptionsInput<ModuleType> =>
    ({
      kind: 'options',
      label: 'Art des Moduls',
      attr: 'moduleType',
      disabled: false,
      required: true,
      data: modulesTypes,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.moduleType))
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

  private languagesInput = (languages: Language[], metadata?: Metadata): OptionsInput<Language> =>
    ({
      kind: 'options',
      label: 'Sprache',
      attr: 'language',
      disabled: false,
      required: true,
      data: languages,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.language))
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

  private frequencyInput = (seasons: Season[], metadata?: Metadata): OptionsInput<Season> =>
    ({
      kind: 'options',
      label: 'Häufigkeit des Angebots',
      attr: 'season',
      disabled: false,
      required: true,
      data: seasons,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.season))
    })

  private moduleCoordinatorInput = (persons: Person[], metadata?: Metadata): OptionsInput<Person> =>
    ({
      kind: 'options',
      label: 'Modulverantwortliche*r',
      attr: 'moduleCoordinator',
      disabled: false,
      required: true,
      data: persons,
      show: this.showPerson,
      initialValue: metadata && (as => as.find(a => metadata.moduleManagement.some(m => m === a.id)))
    })

  private lecturerInput = (persons: Person[], metadata?: Metadata): MultipleOptionsInput<Person> =>
    ({
      kind: 'multiple-options',
      label: 'Dozierende',
      attr: 'lecturer',
      disabled: false,
      required: true,
      data: persons,
      show: this.showPerson,
      initialValue: metadata && (xs => xs.filter(a => metadata.lecturers.some(m => m === a.id)))
    })

  private assessmentMethodsInput = (assessmentMethods: AssessmentMethod[], metadata?: Metadata): ReadOnlyInput<AssessmentMethod> =>
    ({
      kind: 'read-only',
      label: 'Prüfungsformen',
      attr: 'assessment-methods-mandatory',
      disabled: false,
      required: true,
      data: assessmentMethods,
      show: (a) => a.deLabel,
      initialValue: metadata && (xs => xs.filter(a => metadata.assessmentMethods.mandatory.some(m => m.method === a.abbrev))),
      dialogInstance: () => AssessmentMethodDialogComponent.instance(
        this.dialog,
        assessmentMethods,
        metadata ? metadata.assessmentMethods.mandatory : []
      )
    })

  private locationsInput = (locations: Location[], metadata?: Metadata): OptionsInput<Location> =>
    ({
      kind: 'options',
      label: 'Angeboten am Standort',
      attr: 'location',
      disabled: false,
      required: true,
      data: locations,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.location))
    })

  private statusInput = (status: Status[], metadata?: Metadata): OptionsInput<Status> =>
    ({
      kind: 'options',
      label: 'Status',
      attr: 'status',
      disabled: false,
      required: true,
      data: status,
      show: a => a.deLabel,
      initialValue: metadata && (xs => xs.find(a => a.abbrev === metadata.status))
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
    const go = (array: any, depth: number) => {
      for (const k in array) {
        const v = array[k]
        if (Array.isArray(v)) {
          go(v, depth + 1)
        } else {
          const ws = ' '.repeat(depth * 3)
          console.log(ws, k, v)
        }
      }
    }
    go(any, 0)
  }
}
