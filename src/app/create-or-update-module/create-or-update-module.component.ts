import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location as AngularLocation } from '@angular/common'
import { HttpService } from '../http/http.service'
import { forkJoin, of, Subscription } from 'rxjs'
import { EditModuleComponent, EditModulePayload } from '../form/edit-module/edit-module.component'
import { MatDialog } from '@angular/material/dialog'
import { inputs } from './inputs/inputs'
import { showLabel } from '../ops/show-instances'
import { createMetadataProtocol, ModuleCompendiumProtocol } from './metadata-protocol-factory'
import { POPreview } from '../types/pos'
import { PO } from '../types/core/po'
import { Grade } from '../types/core/grade'
import { StudyProgram } from '../types/core/study-program'

@Component({
  selector: 'sched-create-or-update-module',
  templateUrl: './create-or-update-module.component.html',
  styleUrls: ['./create-or-update-module.component.css']
})
export class CreateOrUpdateModuleComponent implements OnInit, OnDestroy {

  @ViewChild('editModuleComponent') editModuleComponent!: EditModuleComponent

  payload?: EditModulePayload

  private readonly id?: string
  private readonly action!: string
  private readonly branch!: string
  private readonly moduleCompendium?: ModuleCompendiumProtocol
  private subs: Subscription[] = []

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: AngularLocation,
    private http: HttpService,
    private dialog: MatDialog
  ) {
    this.action = this.route.snapshot.queryParamMap.get('action')!
    this.id = this.router.getCurrentNavigation()?.extras?.state?.['id']
    this.branch = this.router.getCurrentNavigation()?.extras?.state?.['branch']
    this.moduleCompendium = this.router.getCurrentNavigation()?.extras?.state?.['moduleCompendium']
    console.log(this.moduleCompendium)
  }

  ngOnInit(): void {
    if (this.action === 'update' && this.id === undefined) {
      this.goBack()
    } else {
      const sub = forkJoin([
        this.http.allModules(),
        this.http.allCoreData(),
        this.id ? this.http.moduleCompendiumById(this.id) : of(undefined)
      ]).subscribe(xs => {
        const modules = xs[0]
        const [locations, languages, status, assessmentMethods, moduleTypes, seasons, persons, pos, grades, globalCriteria, studyPrograms, competences] = xs[1]
        const poPreviews = this.toPOPreview(pos, studyPrograms, grades)
        const moduleCompendium = xs[2]
        console.log(moduleCompendium?.deContent)
        console.log(moduleCompendium?.enContent)
        this.payload = {
          objectName: moduleCompendium?.metadata?.title ?? 'Neues Modul',
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
            moduleCompendium
          )
        }
      })
      this.subs.push(sub)
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
    this.subs.forEach(s => s.unsubscribe())
  }

  goBack = (): void =>
    this.location.back()

  onSubmit = (any: any) => {
    const mc = createMetadataProtocol(any)
    const status = this.action === 'update' ? 'modified' : 'added'
    this.subs.push(
      this.http.addToDrafts(this.branch, mc, status, this.id)
        .subscribe(res => console.log(res))
    )
  }
}
