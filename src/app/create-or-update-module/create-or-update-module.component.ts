import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location as AngularLocation } from '@angular/common'
import { Grade, HttpService, MetadataProtocol, PO, POPreview, StudyProgram } from '../http/http.service'
import { forkJoin, from, of, Subscription } from 'rxjs'
import { EditModuleComponent, EditModulePayload } from '../form/edit-module/edit-module.component'
import { MatDialog } from '@angular/material/dialog'
import { inputs } from './inputs/inputs'
import { showLabel } from '../ops/show-instances'

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
        this.http.allModules(),
        this.http.allCoreData(),
        this.id ? this.http.metadataById(this.id) : of(undefined)
      ]).subscribe(xs => {
        const modules = xs[0]
        const [locations, languages, status, assessmentMethods, moduleTypes, seasons, persons, pos, grades, globalCriteria, studyPrograms, competences] = xs[1]
        const poPreviews = this.toPOPreview(pos, studyPrograms, grades)
        const metadata = xs[2]
        this.payload = {
          objectName: metadata?.title ?? 'Neues Modul',
          editType: this.action == 'create' ? 'create' : 'update',
          inputs: inputs(
            modules,
            moduleTypes,
            languages,
            seasons,
            locations,
            status,
            persons,
            assessmentMethods,
            poPreviews,
            competences,
            globalCriteria,
            this.dialog,
            attr => this.editModuleComponent?.formControl(attr).value,
            metadata
          )
        }
      })
    }
  }

  toPOPreview = (pos: PO[], studyPrograms: StudyProgram[], grades: Grade[]): POPreview[] => {
    const abort = (po: PO) => ({id: po.abbrev, label: `??? - ${po.program}`, abbrev: '???'})
    return pos.map(po => {
      const sp = studyPrograms.find(s => s.abbrev === po.program)
      if (!sp) {
        return abort(po)
      }
      const grade = grades.find(g => g.abbrev === sp.grade)
      if (!grade) {
        return abort(po)
      }
      return {
        id: po.abbrev,
        label: `${showLabel(sp)} PO ${po.version} (${showLabel(grade)})`,
        abbrev: `${sp.abbrev} PO ${po.version} (${showLabel(grade)})`
      }
    })
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  goBack = (): void =>
    this.location.back()

  onSubmit = (any: any) => {
    console.log(this.unwrap(any))
  }

  private unwrap = (any: any): MetadataProtocol => {
    const fromArray = (any: any, key: string) =>
      (any as Array<{ value: any }>).map(a => a.value[key])

    return {
      title: any['title'],
      abbrev: any['abbreviation'],
      moduleType: any['moduleType'].abbrev,
      ects: any['ects'],
      language: any['language'].abbrev,
      duration: any['duration'],
      season: any['season'].abbrev,
      workload: {
        lecture: any['workload-lecture'],
        seminar: any['workload-seminar'],
        practical: any['workload-practical'],
        exercise: any['workload-exercise'],
        projectSupervision: any['workload-projectSupervision'],
        projectWork: any['workload-projectWork'],
        selfStudy: 0, // TODO
        total: 0 // TODO
      },
      status: any['status'].abbrev,
      location: any['location'].abbrev,
      participants: undefined, // TODO
      moduleRelation: undefined, // TODO
      moduleManagement: [any['moduleCoordinator'].id],
      lecturers: fromArray(any['lecturer'], 'id'),
      assessmentMethods: {
        mandatory: fromArray(any['assessment-methods-mandatory'], 'method'),
        optional: fromArray(any['assessment-methods-optional'], 'method')
      },
      prerequisites: {
        recommended: {
          text: any['recommended-prerequisites-text'],
          pos: fromArray(any['recommended-prerequisites-po'], 'id'),
          modules: fromArray(any['recommended-prerequisites-modules'], 'id'),
        },
        required: {
          text: any['required-prerequisites-text'],
          pos: fromArray(any['required-prerequisites-po'], 'id'),
          modules: fromArray(any['required-prerequisites-modules'], 'id'),
        }
      },
      po: {
        mandatory: fromArray(any['po-mandatory'], 'po'),
        optional: fromArray(any['po-optional'], 'po')
      },
      competences: any['competences'],
      globalCriteria: any['global-criteria'],
      taughtWith: any['taught-with']
    }
  }
}
