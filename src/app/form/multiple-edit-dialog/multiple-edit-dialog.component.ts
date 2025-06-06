import {
  Component,
  Inject,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { TableHeaderColumn } from '../../generic-ui/table-header-column'
import { FormControl, FormGroup } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import {
  asOptionsInput,
  formControlForInput,
  FormInput,
  FormInputLike,
  isBooleanInput,
  isNumberInput,
  isOptionsInput,
} from '../form-input'
import { NonEmptyArray } from '../../types/non-empty-array'
import { NumberInput, TextInput } from '../plain-input/plain-input.component'
import {
  OptionsInput,
  OptionsInputComponent,
} from '../options-input/options-input.component'
import { BooleanInput } from '../boolean-input/boolean-input.component'
import { throwError } from '../../types/error'

export interface MultipleEditDialogComponentCallback<TableEntry, Option> {
  filterInitialOptionsForComponent: (
    optionsInput: OptionsInput<Option>,
  ) => Option[]
  removeOptionFromOptionsInputComponent: (
    option: TableEntry,
    components: QueryList<OptionsInputComponent<unknown>>,
  ) => void
  addOptionToOptionsInputComponent: (
    option: TableEntry,
    components: QueryList<OptionsInputComponent<unknown>>,
  ) => void
  tableContent: (tableEntry: TableEntry, attr: string) => string
  tableEntryAlreadyExists: (controls: {
    [key: string]: FormControl
  }) => (e: TableEntry) => boolean
  toTableEntry: (controls: { [key: string]: FormControl }) => TableEntry
  isCreateButtonDisabled: (controls: { [key: string]: FormControl }) => boolean
  onValidate: (controls: { [key: string]: FormControl }) => void
}

@Component({
  selector: 'cops-multiple-edit-dialog',
  templateUrl: './multiple-edit-dialog.component.html',
  styleUrls: ['./multiple-edit-dialog.component.css'],
  standalone: false,
})
export class MultipleEditDialogComponent<TableEntry, A, B>
  implements OnDestroy
{
  readonly columns: TableHeaderColumn[]
  readonly displayedColumns: string[]
  readonly dataSource: MatTableDataSource<TableEntry>
  readonly headerTitle: string
  readonly formGroup: FormGroup
  readonly inputs: { [key: string]: [FormInput<A, B>, FormControl] } = {}
  readonly controls: { [key: string]: FormControl } = {}

  @ViewChildren('options') options!: QueryList<OptionsInputComponent<unknown>>

  private callback?: MultipleEditDialogComponentCallback<TableEntry, A>

  constructor(
    private dialogRef: MatDialogRef<
      MultipleEditDialogComponent<TableEntry, A, B>,
      TableEntry[]
    >,
    @Inject(MAT_DIALOG_DATA)
    [callback, columns, title, formInputs, tableEntries]: [
      MultipleEditDialogComponentCallback<TableEntry, A>,
      TableHeaderColumn[],
      string,
      NonEmptyArray<FormInput<A, B>>,
      TableEntry[],
    ],
  ) {
    this.callback = callback
    this.columns = columns
    this.displayedColumns = columns.map((a) => a.attr)
    this.displayedColumns.push('action')
    this.dataSource = new MatTableDataSource<TableEntry>(tableEntries)
    this.headerTitle = title
    this.formGroup = new FormGroup({})
    formInputs.forEach((i) => {
      const control = formControlForInput(i)
      const input = i
      if (isOptionsInput(input)) {
        input.data = callback.filterInitialOptionsForComponent(input)
      }
      const key = input.attr
      this.formGroup.addControl(key, control)
      this.inputs[key] = [input, control]
      this.controls[key] = control
    })
  }

  static instance = <TableEntry_, A_, B_>(
    dialog: MatDialog,
    callback: MultipleEditDialogComponentCallback<TableEntry_, A_>,
    columns: TableHeaderColumn[],
    title: string,
    formInputs: NonEmptyArray<FormInputLike>,
    tableEntries: TableEntry_[],
  ) =>
    dialog.open<MultipleEditDialogComponent<TableEntry_, A_, B_>>(
      MultipleEditDialogComponent,
      {
        data: [callback, columns, title, formInputs, tableEntries],
        minWidth: window.innerWidth * 0.5,
      },
    )

  ngOnDestroy() {
    this.callback = undefined
  }

  // UI functions

  validate = () => this.callback?.onValidate(this.controls)

  nonEmptyTable = () => this.dataSource.data.length > 0

  cancel = () => this.dialogRef.close()

  applyChanges = () => this.dialogRef.close(this.dataSource.data)

  add = () => {
    if (this.callback === undefined) {
      console.warn('callback is undefined')
      return
    }
    const alreadyExists = this.callback.tableEntryAlreadyExists(this.controls)
    if (this.dataSource.data.some(alreadyExists)) {
      console.warn('already exists', this.dataSource.data, this.controls)
      return
    }
    const tableEntry = this.callback.toTableEntry(this.controls)
    this.dataSource.data = [...this.dataSource.data, tableEntry]
    this.resetControls()
    this.callback.removeOptionFromOptionsInputComponent(
      tableEntry,
      this.options,
    )
  }

  delete = (tableEntry: TableEntry) => {
    if (this.callback === undefined) {
      return
    }
    this.dataSource.data = this.dataSource.data.filter((e) => e !== tableEntry)
    this.callback.addOptionToOptionsInputComponent(tableEntry, this.options)
  }

  createButtonDisabled = (): boolean =>
    this.callback
      ? this.callback.isCreateButtonDisabled(this.controls) ||
        this.formGroup.invalid
      : true

  tableContent = (tableEntry: TableEntry, attr: string): string =>
    this.callback?.tableContent(tableEntry, attr) ?? '???'

  asTextInput = (i: [FormInput<A, B>, FormControl]): TextInput | NumberInput =>
    (i[0] as TextInput) || (i[0] as NumberInput)

  asOptions = ([i]: [FormInput<A, B>, FormControl]) =>
    asOptionsInput(i) ??
    throwError(`expected form input to be options input, but was ${i.kind}`)

  asBoolean = (i: [FormInput<A, B>, FormControl]) => i[0] as BooleanInput

  getInputKind = (i: [FormInput<A, B>, FormControl]): string => i[0].kind

  getInputFormControl = (i: [FormInput<A, B>, FormControl]): FormControl => i[1]

  originalOrder = (): number => {
    return 0
  }

  private resetControls = () => {
    if (this.callback === undefined) {
      return
    }
    Object.values(this.inputs).forEach(([i, fc]) => {
      fc.reset('', { emitEvent: true })
      if (isBooleanInput(i)) {
        fc.setValue(false, { emitEvent: true })
      }
      if (isNumberInput(i)) {
        fc.setValue(undefined, { emitEvent: true })
      }
    })
  }
}
