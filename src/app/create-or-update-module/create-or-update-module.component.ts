import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location as AngularLocation } from '@angular/common'
import { HttpService } from '../http/http.service'
import { Observable, of, Subscription, zip } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { parseModuleCompendium } from '../types/metadata-protocol-factory'
import { POPreview } from '../types/pos'
import { PO } from '../types/core/po'
import { Degree } from '../types/core/degree'
// import { StudyProgram } from '../types/core/study-program'
import { AppStateService } from '../state/app-state.service'
import { mapOpt } from '../ops/undefined-ops'
import { ModuleLike, ModuleProtocol } from '../types/moduleCore'
import { throwError } from '../types/error'
import { showLabel } from '../ops/show.instances'
import { StudyProgram } from "../types/module-compendium";

export function toPOPreview(
  pos: ReadonlyArray<PO>,
  studyPrograms: ReadonlyArray<StudyProgram>,
  degrees: ReadonlyArray<Degree>,
): ReadonlyArray<POPreview> {
  const abort = (po: PO) => ({id: po.abbrev, label: `??? - ${po.program}`, abbrev: '???'})
  return pos.map(po => {
    const sp = studyPrograms.find(s => s.id === po.program)
    if (!sp) {
      return abort(po)
    }
    const degree = degrees.find(degree => degree.id === sp.degree.id)
    if (!degree) {
      return abort(po)
    }
    return {
      id: po.abbrev,
      label: `${showLabel(sp)} PO ${po.version} (${showLabel(degree)})`,
      abbrev: `${sp.id} PO ${po.version} (${showLabel(degree)})`,
    }
  })
}

@Component({
  selector: 'cops-create-or-update-module',
  templateUrl: './create-or-update-module.component.html',
  styleUrls: ['./create-or-update-module.component.css'],
})
export class CreateOrUpdateModuleComponent implements OnInit, OnDestroy {

  // @ViewChild('editModuleComponent') editModuleComponent!: EditModuleComponent<unknown, unknown>

  // payload?: EditModulePayload<unknown, unknown>

  private readonly id?: string
  private readonly action!: string
  private sub?: Subscription

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: AngularLocation,
    private http: HttpService,
    private dialog: MatDialog,
    private appState: AppStateService,
  ) {
    this.action = route.snapshot.queryParamMap.get('action') ?? throwError('expected action parameter')
    this.id = this.router.getCurrentNavigation()?.extras?.state?.['id']
    const moduleCompendium: ModuleProtocol | undefined = this.router.getCurrentNavigation()?.extras?.state?.['moduleCompendium']
    const moduleCompendium$: Observable<ModuleLike | undefined> =
      mapOpt(moduleCompendium, of) ??
      mapOpt(this.id, this.http.moduleDescriptionById) ??
      of(undefined)
    this.sub = zip([
      this.appState.allModules$(),
      this.appState.coreData$(),
      moduleCompendium$,
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
        competences,
      ] = coreData
      const poPreviews = toPOPreview(pos, studyPrograms, grades)
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
