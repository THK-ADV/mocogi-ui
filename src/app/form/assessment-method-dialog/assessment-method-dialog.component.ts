import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { FormControl, FormGroup } from '@angular/forms'
import { AssessmentMethod, AssessmentMethodEntry } from '../../http/http.service'
import { formControlForOptionsInput, OptionsInput, OptionsInputComponent } from '../options-input/options-input.component'
import { TableHeaderColumn } from '../../generic-ui/table-header-column'
import { MatTableDataSource } from '@angular/material/table'
import { formControlForPainInput, NumberInput } from '../plain-input/plain-input.component'

export interface TableContent {
  entry: AssessmentMethodEntry
  method: string
  percentage: string
  precondition: string
}

@Component({
  selector: 'sched-assessment-method-dialog',
  templateUrl: './assessment-method-dialog.component.html',
  styleUrls: ['./assessment-method-dialog.component.css']
})
export class AssessmentMethodDialogComponent implements OnInit {
  readonly displayedColumns: string[]
  readonly columns: TableHeaderColumn[]
  readonly formGroup: FormGroup
  readonly assessmentMethodInput: OptionsInput<AssessmentMethod>
  readonly percentageInput: NumberInput
  readonly preconditionInput: OptionsInput<AssessmentMethod>
  readonly dataSource: MatTableDataSource<TableContent>
  readonly headerTitle: string

  @ViewChild('assessmentMethodOptionsInputComponent') assessmentMethodOptionsInputComponent!: OptionsInputComponent<AssessmentMethod>
  @ViewChild('preconditionOptionsInputComponent') preconditionOptionsInputComponent!: OptionsInputComponent<AssessmentMethod>

  constructor(
    private dialogRef: MatDialogRef<AssessmentMethodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [AssessmentMethod[], AssessmentMethodEntry[]],
  ) {
    this.displayedColumns = ['method', 'percentage', 'precondition', 'action']
    this.columns = [
      {attr: this.displayedColumns[0], title: 'Prüfungsform'},
      {attr: this.displayedColumns[1], title: 'Prozentualer Anteil'},
      {attr: this.displayedColumns[2], title: 'Vorbedingungen'},
    ]
    this.dataSource = new MatTableDataSource<TableContent>()
    this.headerTitle = 'Prüfungsformen bearbeiten'
    this.assessmentMethodInput = {
      kind: 'options',
      label: this.columns[0].title + ' *',
      attr: this.columns[0].attr,
      disabled: false,
      required: false,
      data: data[0].filter(d => !data[1].some(dd => dd.method === d.abbrev)),
      show: (a) => a.deLabel,
    }
    this.percentageInput = {
      kind: 'number',
      label: this.columns[1].title + ' (Optional)',
      attr: this.columns[1].attr,
      disabled: false,
      required: false
    }
    this.preconditionInput = {
      kind: 'options',
      label: this.columns[2].title + ' (Optional)',
      attr: this.columns[2].attr,
      disabled: false,
      required: false,
      data: data[0],
      show: (a) => a.deLabel,
    }
    this.formGroup = new FormGroup({})
    this.formGroup.addControl(
      this.assessmentMethodInput.attr,
      formControlForOptionsInput(this.assessmentMethodInput)
    )
    this.formGroup.addControl(
      this.percentageInput.attr,
      formControlForPainInput(this.percentageInput)
    )
    this.formGroup.addControl(
      this.preconditionInput.attr,
      formControlForOptionsInput(this.preconditionInput)
    )
  }

  static instance(
    dialog: MatDialog,
    options: AssessmentMethod[],
    entries: AssessmentMethodEntry[]
  ): MatDialogRef<AssessmentMethodDialogComponent> {
    return dialog.open(AssessmentMethodDialogComponent, {
      data: [options, entries],
      minWidth: window.innerWidth * 0.5
    })
  }

  ngOnInit() {
    this.initDataSource()
  }

  initDataSource = () => {
    this.dataSource.data = this.data[1].map(this.toTableContent)
  }

  removeOption = (a: AssessmentMethod) => {
    this.assessmentMethodOptionsInputComponent.removeOption(a)
  }

  addOption = (a: AssessmentMethod) => {
    this.assessmentMethodOptionsInputComponent.addOption(a)
  }

  cancel = () =>
    this.dialogRef.close() // TODO return with data. dispatch them back

  add = () => {
    const assessmentMethod = this.assessmentMethodFormControl().value as AssessmentMethod
    const percentage = this.percentageFormControl().value as number | undefined
    const precondition = this.preconditionFormControl().value as AssessmentMethod | undefined

    if (this.dataSource.data.some(a => a.entry.method === assessmentMethod.abbrev)) {
      return
    }

    const tableContent = this.toTableContent({
      method: assessmentMethod.abbrev,
      percentage: percentage,
      precondition: precondition ? [precondition.abbrev] : [],
    })

    this.dataSource.data = [...this.dataSource.data, tableContent]
    this.resetControls()
    this.removeOption(assessmentMethod)
  }

  delete = (e: TableContent) => {
    this.dataSource.data = this.dataSource.data.filter(a => a.entry.method !== e.entry.method)
    const am = this.data[0].find(a => a.abbrev === e.entry.method)
    am && this.addOption(am)
  }

  private resetControls = () => {
    this.assessmentMethodOptionsInputComponent.reset()
    this.preconditionOptionsInputComponent.reset()
    this.percentageFormControl().setValue(undefined, {emitEvent: false})
  }

  formControl = (attr: string) =>
    // @ts-ignore
    this.formGroup.controls[attr] as FormControl

  assessmentMethodFormControl = () =>
    this.formControl(this.assessmentMethodInput.attr)

  percentageFormControl = () =>
    this.formControl(this.percentageInput.attr)

  preconditionFormControl = () =>
    this.formControl(this.preconditionInput.attr)

  nonEmpty = () => this.dataSource.data.length > 0

  validAssessmentMethod = () => {
    const amFc = this.assessmentMethodFormControl()
    return amFc.value !== undefined &&
      amFc.value !== '' &&
      amFc.value !== null
  }

  validPercentage = () => {
    const pFc = this.percentageFormControl()
    return pFc.value === undefined ||
      (typeof pFc.value === 'string' && !isNaN(Number(pFc.value)))
  }

  validPrecondition = () => {
    const pFc = this.preconditionFormControl()
    return pFc.value === undefined || typeof pFc.value === 'object'
  }

  createButtonDisabled = (): boolean =>
    !this.validAssessmentMethod() || !this.validPercentage() || !this.validPrecondition() || this.formGroup.invalid

  validate = () => {
    this.validPrecondition()
    // console.log('valid am', this.validAssessmentMethod())
    // console.log('valid p', this.validPercentage())
    // console.log('valid fg', this.formGroup.valid)
  }

  // ???

  toTableContent = (e: AssessmentMethodEntry): TableContent =>
    ({
      entry: e,
      method: this.lookup(e.method),
      percentage: e.percentage ? `${e.percentage} %` : '',
      precondition: e.precondition.map(this.lookup).join(', ')
    })

  lookup = (method: string) =>
    this.data[0].find(d => d.abbrev === method)?.deLabel ?? '???'
}
