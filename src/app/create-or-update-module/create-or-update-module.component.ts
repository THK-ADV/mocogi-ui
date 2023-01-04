import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location as AngularLocation } from '@angular/common'
import { Grade, HttpService, PO, POPreview, StudyProgram } from '../http/http.service'
import { forkJoin, of, Subscription } from 'rxjs'
import { EditModuleComponent, EditModulePayload } from '../form/edit-module/edit-module.component'
import { MatDialog } from '@angular/material/dialog'
import { inputs } from './inputs/inputs'

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
        label: `${sp.deLabel} PO ${po.version} (${grade.deLabel})`,
        abbrev: `${sp.abbrev} PO ${po.version} (${grade.deLabel})`
      }
    })
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
