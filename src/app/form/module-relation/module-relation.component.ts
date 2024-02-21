import { Component, Inject, OnDestroy, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { FormControl, FormGroup } from '@angular/forms'
import { formControlForOptionsInput, OptionsInput, OptionsInputComponent } from '../options-input/options-input.component'
import { TableHeaderColumn } from '../../generic-ui/table-header-column'
import { MatTableDataSource } from '@angular/material/table'
import { validMandatoryObject } from '../../create-or-update-module/callbacks/callback-validation'
import { mapOpt } from '../../ops/undefined-ops'
import { ConfirmationDialogComponent } from '../../generic-ui/confirmation-dialog/confirmation-dialog.component'
import { Subscription } from 'rxjs'
import { ModuleRelation } from '../../types/module-relation'
import { ModuleCore } from '../../types/moduleCore'
import { showModule } from '../../ops/show.instances'

interface ModuleRelationType {
  label: 'parent' | 'child'
}

function showModuleRelationType(t: ModuleRelationType): string {
  switch (t.label) {
    case 'parent':
      return 'Parent'
    case 'child':
      return 'Child'
  }
}

function unknownModule(id: string): ModuleCore {
  return {id: id, abbrev: '???', title: '???'}
}

function modulesOf(moduleRelation: ModuleRelation, modules: ModuleCore[]): ModuleCore[] {
  switch (moduleRelation.kind) {
    case 'parent':
      return moduleRelation.children.map(id => modules.find(m => m.id === id) ?? unknownModule(id))
    case 'child':
      return [modules.find(m => m.id === moduleRelation.parent) ?? unknownModule(moduleRelation.parent)]
  }
}

function initialModules(moduleRelation: ModuleRelation | undefined, modules: ModuleCore[]): ModuleCore[] {
  return moduleRelation ? modulesOf(moduleRelation, modules) : []
}

@Component({
  selector: 'cops-module-relation',
  templateUrl: './module-relation.component.html',
  styleUrls: ['./module-relation.component.css'],
})
export class ModuleRelationComponent implements OnDestroy {
  readonly headerTitle: string
  readonly formGroup: FormGroup
  readonly relationTypeInput: OptionsInput<ModuleRelationType>
  readonly moduleInputType: OptionsInput<ModuleCore>
  readonly columns: TableHeaderColumn[]
  readonly displayedColumns: string[]
  readonly dataSource: MatTableDataSource<ModuleCore>

  private currentRelationType: ModuleRelationType | undefined
  private sub?: Subscription

  @ViewChild('typeComponent') typeComponent!: OptionsInputComponent<ModuleRelationType>
  @ViewChild('moduleComponent') moduleComponent!: OptionsInputComponent<ModuleCore>

  constructor(
    private readonly dialog: MatDialog,
    private dialogRef: MatDialogRef<ModuleRelationComponent, ModuleRelation[]>,
    @Inject(MAT_DIALOG_DATA) private payload: [ModuleRelation | undefined, ModuleCore[]],
  ) {
    const moduleRelation = payload[0]
    const modules = payload[1]
    this.currentRelationType = mapOpt(moduleRelation, m => ({label: m.kind}))
    this.formGroup = new FormGroup({})
    this.columns = [
      {title: 'Art der Beziehung', attr: 'module-relation-type'},
      {title: 'Modul', attr: 'module-relation-module'},
    ]
    this.displayedColumns = [...this.columns.map(a => a.attr), 'action']
    this.dataSource = new MatTableDataSource<ModuleCore>(initialModules(moduleRelation, modules))
    this.headerTitle = 'Modulbeziehungen bearbeiten'
    this.relationTypeInput = {
      kind: 'options',
      label: this.columns[0].title,
      attr: this.columns[0].attr,
      disabled: false,
      required: true,
      data: [{label: 'parent'}, {label: 'child'}],
      show: showModuleRelationType,
      initialValue: moduleRelation && ((xs) => xs.find(x => x.label === moduleRelation.kind)),
    }
    this.formGroup.addControl('type', formControlForOptionsInput(this.relationTypeInput))
    this.moduleInputType = {
      kind: 'options',
      label: this.columns[1].title,
      attr: this.columns[1].attr,
      disabled: false,
      required: true,
      data: this.dataSource.data.length === 0
        ? modules
        : modules.filter(m => !this.dataSource.data.some(x => x.id === m.id)),
      show: showModule,
    }
    this.formGroup.addControl('module', formControlForOptionsInput(this.moduleInputType))
  }

  static instance = (
    dialog: MatDialog,
    moduleRelation: ModuleRelation | undefined,
    modules: ModuleCore[],
    self: string | undefined,
  ): MatDialogRef<ModuleRelationComponent> => {
    return dialog.open<ModuleRelationComponent>(
      ModuleRelationComponent,
      {
        data: [moduleRelation, self ? modules.filter(m => m.id !== self) : modules],
        minWidth: window.innerWidth * 0.5,
      },
    )
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

  typeControl = () =>
    this.formGroup.controls['type'] as FormControl

  moduleControl = () =>
    this.formGroup.controls['module'] as FormControl

  cancel = () =>
    this.dialogRef.close()

  applyChanges = () => {
    if (!this.currentRelationType?.label) {
      return
    }
    const modules = this.dataSource.data.map(d => d.id)
    let res: ModuleRelation
    switch (this.currentRelationType?.label) {
      case 'parent':
        res = {kind: 'parent', children: modules}
        break
      case 'child':
        res = {kind: 'child', parent: modules[0]}
        break
    }
    this.dialogRef.close([res])
  }

  add = () => {
    const module = this.moduleValue()
    if (this.dataSource.data.some(m => m.id === module.id)) {
      return
    }
    this.dataSource.data = [...this.dataSource.data, module]
    this.moduleComponent.removeOption(module)
    this.moduleComponent.reset()
  }

  delete = (module: ModuleCore) => {
    this.dataSource.data = this.dataSource.data.filter(m => m.id !== module.id)
    this.moduleComponent.addOption(module)
    this.moduleComponent.reset()
  }

  nonEmptyTable = () =>
    this.dataSource.data.length > 0

  isValid = () => {
    const relationType = this.relationTypeValue()
    const module = this.moduleValue()
    if (this.currentRelationType?.label === 'child' && this.dataSource.data.length === 1) {
      return false
    }
    return validMandatoryObject(relationType) &&
      validMandatoryObject(module) &&
      this.formGroup.valid
  }

  tableContent = (module: ModuleCore, attr: string): string => {
    switch (attr) {
      case this.columns[0].attr:
        return mapOpt(this.currentRelationType, showModuleRelationType) ?? '???'
      case this.columns[1].attr:
        return module.title
      default:
        return '???'
    }
  }

  relationTypeSelected = (type: ModuleRelationType) => {
    if (this.currentRelationType && this.currentRelationType !== type) {
      this.sub = ConfirmationDialogComponent.instance(
        this.dialog,
        {
          title: 'Auswahl verwerfen',
          value: 'Soll die Auswahl verworfen werden, da eine andere Modulbeziehung ausgewählt wurde?',
        },
      )
        .afterClosed()
        .subscribe(res => {
          if (res === 'ok') {
            this.currentRelationType = type
            this.moduleComponent.reset()
            this.dataSource.data = []
          } else {
            this.typeControl().setValue(this.currentRelationType)
          }
        })
    } else {
      this.currentRelationType = type
    }
  }

  private relationTypeValue = () =>
    this.typeControl().value as ModuleRelationType

  private moduleValue = () =>
    this.moduleControl().value as ModuleCore

  deleteAll = () =>
    this.dialogRef.close([])
}
