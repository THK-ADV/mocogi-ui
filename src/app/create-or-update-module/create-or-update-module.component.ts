import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location as AngularLocation } from '@angular/common'
import { HttpService } from '../http/http.service'
import { Observable, of, Subscription, zip } from 'rxjs'
import { EditModuleComponent, EditModulePayload } from '../form/edit-module/edit-module.component'
import { MatDialog } from '@angular/material/dialog'
import { inputs } from './inputs/inputs'
import { parseModuleCompendium } from '../types/metadata-protocol-factory'
import { POPreview } from '../types/pos'
import { PO } from '../types/core/po'
import { Grade } from '../types/core/grade'
import { StudyProgram } from '../types/core/study-program'
import { AppStateService } from '../state/app-state.service'
import { mapOpt } from '../ops/undefined-ops'
import { ModuleCompendiumLike, ModuleCompendiumProtocol } from '../types/module-compendium'
import { throwError } from '../types/error'
import { showLabel } from '../ops/show.instances'

function toPOPreview(
  pos: ReadonlyArray<PO>,
  studyPrograms: ReadonlyArray<StudyProgram>,
  grades: ReadonlyArray<Grade>
): ReadonlyArray<POPreview> {
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

@Component({
  selector: 'sched-create-or-update-module',
  templateUrl: './create-or-update-module.component.html',
  styleUrls: ['./create-or-update-module.component.css']
})
export class CreateOrUpdateModuleComponent implements OnInit, OnDestroy {

  @ViewChild('editModuleComponent') editModuleComponent!: EditModuleComponent<unknown, unknown>

  payload?: EditModulePayload<unknown, unknown>

  private readonly id?: string
  private readonly action!: string
  private sub?: Subscription

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: AngularLocation,
    private http: HttpService,
    private dialog: MatDialog,
    private appState: AppStateService
  ) {
    this.action = route.snapshot.queryParamMap.get('action') ?? throwError('expected action parameter')
    this.id = this.router.getCurrentNavigation()?.extras?.state?.['id']
    const moduleCompendium: ModuleCompendiumProtocol | undefined = this.router.getCurrentNavigation()?.extras?.state?.['moduleCompendium']
    const moduleCompendium$: Observable<ModuleCompendiumLike | undefined> =
      mapOpt(moduleCompendium, of) ??
      mapOpt(this.id, this.http.moduleCompendiumById) ??
      of(undefined)
    this.sub = zip([
      this.appState.allModules$(),
      this.appState.coreData$(),
      moduleCompendium$
    ]).subscribe(([modules, coreData, moduleCompendium]) => {
      const [
        locations,
        languages,
        status,
        assessmentMethods,
        moduleTypes,
        seasons,
        persons,
        pos,
        grades,
        globalCriteria,
        studyPrograms,
        competences
      ] = coreData
      const poPreviews = toPOPreview(pos, studyPrograms, grades)
      this.payload = {
        objectName: moduleCompendium?.metadata?.title ?? 'Neues Modul',
        editType: this.action === 'create' ? 'create' : 'update',
        inputs: inputs(
          [...modules],
          [...moduleTypes],
          [...languages],
          [...seasons],
          [...locations],
          [...status],
          [...persons],
          [...assessmentMethods],
          [...poPreviews],
          [...competences],
          [...globalCriteria],
          this.dialog,
          attr => this.editModuleComponent?.formControl(attr).value,
          moduleCompendium,
          this.id
        )
      }
    })
  }

  ngOnInit(): void {
    if (this.action === 'update' && this.id === undefined) {
      this.goBack()
    } else {
      this.appState.getAllModules()
      this.appState.getCoreData()
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  goBack = (): void =>
    this.location.back()

  onSubmit = (value: unknown) => {
    const mc = parseModuleCompendium(value)
    this.appState.addModuleDraft(mc, this.id)
  }
}
