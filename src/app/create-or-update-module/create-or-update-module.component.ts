import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location as AngularLocation } from '@angular/common'
import { HttpService } from '../http/http.service'
import { forkJoin, of, Subscription } from 'rxjs'
import { EditModuleComponent, EditModulePayload } from '../form/edit-module/edit-module.component'
import { MatDialog } from '@angular/material/dialog'
import { inputs } from './inputs/inputs'

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
          inputs: inputs(
            moduleTypes,
            languages,
            seasons,
            locations,
            status,
            persons,
            assessmentMethods,
            this.dialog,
            attr => this.editModuleComponent?.formControl(attr).value,
            metadata
          )
        }
      })
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
