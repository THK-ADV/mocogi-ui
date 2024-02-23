import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { arrayToObject } from '../../ops/array-to-object'
import { OptionsInput, OptionsInputComponent } from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import { validMandatoryBoolean, validMandatoryCommaSeparatedNumber, validMandatoryObject } from './callback-validation'
import { POOptional } from '../../types/pos'
import { ModuleCore } from '../../types/moduleCore'
import { showRecommendedSemester, showStudyProgram } from '../../ops/show.instances'
import { StudyProgram } from '../../types/module-compendium'

export class PoOptionalCallback implements MultipleEditDialogComponentCallback<POOptional, StudyProgram> {
  readonly all: { [id: string]: StudyProgram } = {}
  readonly selected: { [id: string]: POOptional } = {}
  readonly genericModules: { [id: string]: ModuleCore } = {}

  constructor(
    all: Readonly<StudyProgram[]>,
    selected: Readonly<POOptional[]>,
    genericModules: Readonly<ModuleCore>[],
  ) {
    this.all = arrayToObject(all, a => a.po.id)
    this.selected = arrayToObject(selected, a => a.po)
    this.genericModules = arrayToObject(genericModules, a => a.id)
  }

  filterInitialOptionsForComponent(optionsInput: OptionsInput<StudyProgram>): StudyProgram[] {
    const data = optionsInput.data
    if (!Array.isArray(data)) {
      return []
    }
    if (optionsInput.attr === 'po') {
      return data.filter(d => !this.selected[d.id])
    } else {
      return data
    }
  }

  addOptionToOptionsInputComponent(option: POOptional, components: QueryList<OptionsInputComponent<unknown>>): void {
    const studyProgram = this.lookup(option.po)
    const component = components.find(a => a.input.attr === 'po')
    studyProgram && component && component.addOption(studyProgram)
    component?.reset()
  }

  removeOptionFromOptionsInputComponent(option: POOptional, components: QueryList<OptionsInputComponent<unknown>>): void {
    const studyProgram = this.lookup(option.po)
    const component = components.find(a => a.input.attr === 'po')
    studyProgram && component && component.removeOption(studyProgram)
    component?.reset()
  }

  tableContent(tableEntry: POOptional, attr: string): string {
    switch (attr) {
      case 'po':
        return this.lookupLabel(tableEntry.po)
      case 'instance-of':
        return this.genericModules[tableEntry.instanceOf].title
      case 'part-of-catalog':
        return tableEntry.partOfCatalog ? 'Ja' : 'Nein'
      case 'recommended-semester':
        return showRecommendedSemester(tableEntry.recommendedSemester)
      default:
        return '???'
    }
  }

  tableEntryAlreadyExists(controls: { [key: string]: FormControl }): (e: POOptional) => boolean {
    const studyProgram = this.getStudyProgramValue(controls)
    return ({po}) => po === studyProgram.po.id
  }

  toTableEntry(controls: { [key: string]: FormControl }): POOptional {
    const studyProgram = this.getStudyProgramValue(controls)
    const instanceOf = this.getInstanceOfValue(controls)
    const partOfCatalog = this.getPartOfCatalogValue(controls)
    const recommendedSemester = this.getRecommendedSemesterValue(controls)

    return {
      po: studyProgram.po.id,
      instanceOf: instanceOf.id,
      partOfCatalog: partOfCatalog,
      recommendedSemester: recommendedSemester,
      specialization: studyProgram.specialization?.id,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onValidate(_controls: { [key: string]: FormControl }): void {
    return
  }

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    return !this.validPO(controls['po'].value) ||
      !this.validInstanceOf(controls['instance-of'].value) ||
      !this.validPartOfCatalog(controls['part-of-catalog'].value) ||
      !this.validRecommendedSemester(controls['recommended-semester'].value)
  }

  private validPO = (value: unknown) =>
    validMandatoryObject(value)

  private validInstanceOf = (value: unknown) =>
    validMandatoryObject(value)

  private validPartOfCatalog = (value: unknown) =>
    validMandatoryBoolean(value)

  private validRecommendedSemester = (value: unknown) =>
    validMandatoryCommaSeparatedNumber(value)

  private getRecommendedSemesterValue = (controls: { [p: string]: FormControl }) =>
    (controls['recommended-semester'].value as string)
      .split(',')
      .map(a => Number(a))

  private getStudyProgramValue = (controls: { [p: string]: FormControl }) =>
    controls['po'].value as StudyProgram

  private getInstanceOfValue = (controls: { [p: string]: FormControl }) =>
    controls['instance-of'].value as ModuleCore

  private getPartOfCatalogValue = (controls: { [p: string]: FormControl }) =>
    controls['part-of-catalog'].value as boolean

  private lookup = (id: string): StudyProgram | undefined =>
    this.all[id]

  private lookupLabel = (id: string): string => {
    const sp = this.lookup(id)
    return sp ? showStudyProgram(sp) : id
  }
}
