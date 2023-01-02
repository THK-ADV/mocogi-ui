import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location as AngularLocation } from '@angular/common'
import { AssessmentMethod, HttpService, Language, Location, Metadata, ModuleType, Person, Season, Status } from '../http/http.service'
import { forkJoin, of, Subscription } from 'rxjs'
import { EditModuleComponent, EditModulePayload } from '../form/edit-module/edit-module.component'
import { MatDialog } from '@angular/material/dialog'
import {
  abbreviationInput,
  creditsInput,
  durationInput,
  frequencyInput,
  languagesInput,
  locationsInput,
  moduleTypesInput,
  statusInput,
  titleInput
} from './inputs/simple-inputs'
import { lecturerInput, moduleCoordinatorInput } from './inputs/responsibility-input'
import { assessmentMethodsInput } from './inputs/assessment-method-input'

export const requiredLabel = (label: string): string =>
  label + ' *'

export const optionalLabel = (label: string): string =>
  label + ' (Optional)'

@Component({
  selector: 'sched-create-or-update-module',
  templateUrl: './create-or-update-module.component.html',
  styleUrls: ['./create-or-update-module.component.css']
})
export class CreateOrUpdateModuleComponent implements OnInit, OnDestroy {

  @ViewChild('editModuleComponent') editModuleComponent!: EditModuleComponent

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
      titleInput(metadata),
      abbreviationInput(metadata),
      moduleTypesInput(moduleTypes, metadata),
      creditsInput(metadata),
      languagesInput(languages, metadata),
      durationInput(metadata),
      frequencyInput(seasons, metadata),
      locationsInput(locations, metadata),
      statusInput(status, metadata)
    ]
  })

  private responsibilities = (persons: Person[], metadata?: Metadata) =>
    ({
      header: 'Verantwortliche',
      value: [
        moduleCoordinatorInput(persons, metadata),
        lecturerInput(
          this.dialog,
          persons,
          attr => this.currentLecturerSelection(attr, persons, metadata)
        ),
      ]
    })

  private assessmentMethods = (assessmentMethods: AssessmentMethod[], metadata?: Metadata) =>
    ({
      header: 'Prüfungsformen',
      value: [
        assessmentMethodsInput(
          this.dialog,
          assessmentMethods,
          attr => this.currentAssessmentMethodMandatorySelection(attr, metadata)
        )
      ]
    })

  private currentMultipleSelectionValue = <A>(attr: string, metadata: Metadata | undefined, fallback: (metadata: Metadata) => A[]): A[] => {
    const entries = this.editModuleComponent?.formControl(attr).value
    return Array.isArray(entries) ? entries.map(e => e.value) : (metadata ? fallback(metadata) : [])
  }

  private currentLecturerSelection = (attr: string, allPersons: Person[], metadata?: Metadata) =>
    this.currentMultipleSelectionValue(
      attr,
      metadata,
      m => allPersons.filter(p => m.lecturers.some(l => l === p.id))
    )

  private currentAssessmentMethodMandatorySelection = (attr: string, metadata?: Metadata) =>
    this.currentMultipleSelectionValue(attr, metadata, m => m.assessmentMethods.mandatory)

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
