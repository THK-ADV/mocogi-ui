import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { arrayToObject } from '../../ops/array-to-object'
import { OptionsInput, OptionsInputComponent } from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import { validMandatoryCommaSeparatedNumber, validMandatoryObject } from './callback-validation'
import { POMandatory } from '../../types/pos'
import { showRecommendedSemester, showStudyProgram } from '../../ops/show.instances'
import { StudyProgram } from '../../types/module-compendium'

export class PoMandatoryCallback implements MultipleEditDialogComponentCallback<POMandatory, StudyProgram> {
  readonly all: { [id: string]: StudyProgram } = {}
  readonly selected: { [id: string]: POMandatory } = {}

  constructor(all: Readonly<StudyProgram[]>, selected: Readonly<POMandatory[]>) {
    this.all = arrayToObject(all, a => a.po.id)
    this.selected = arrayToObject(selected, a => a.po)
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

  addOptionToOptionsInputComponent(option: POMandatory, components: QueryList<OptionsInputComponent<unknown>>): void {
    const studyProgram = this.lookup(option.po)
    const component = components.find(a => a.input.attr === 'po')
    studyProgram && component && component.addOption(studyProgram)
    component?.reset()
  }

  removeOptionFromOptionsInputComponent(option: POMandatory, components: QueryList<OptionsInputComponent<unknown>>): void {
    const studyProgram = this.lookup(option.po)
    const component = components.find(a => a.input.attr === 'po')
    studyProgram && component && component.removeOption(studyProgram)
    component?.reset()
  }

  tableContent(tableEntry: POMandatory, attr: string): string {
    switch (attr) {
      case 'po':
        return this.lookupLabel(tableEntry.po)
      case 'recommended-semester':
        return showRecommendedSemester(tableEntry.recommendedSemester)
      default:
        return '???'
    }
  }

  tableEntryAlreadyExists(controls: { [key: string]: FormControl }): (e: POMandatory) => boolean {
    const sp = this.getStudyProgramValue(controls)
    return ({po}) => po === sp.po.id
  }

  toTableEntry(controls: { [key: string]: FormControl }): POMandatory {
    const studyProgram = this.getStudyProgramValue(controls)
    const recommendedSemester = this.getRecommendedSemesterValue(controls)

    return {
      po: studyProgram.po.id,
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
      !this.validRecommendedSemester(controls['recommended-semester'].value)
  }

  private validPO = (value: unknown) =>
    validMandatoryObject(value)

  private validRecommendedSemester = (value: unknown) =>
    validMandatoryCommaSeparatedNumber(value)

  private getRecommendedSemesterValue = (controls: { [p: string]: FormControl }) =>
    (controls['recommended-semester'].value as string)
      .split(',')
      .map(a => Number(a))

  private getStudyProgramValue = (controls: { [p: string]: FormControl }) =>
    controls['po'].value as StudyProgram

  private lookup = (id: string): StudyProgram | undefined =>
    this.all[id]

  private lookupLabel = (id: string): string => {
    const sp = this.lookup(id)
    return sp ? showStudyProgram(sp) : id
  }
}
