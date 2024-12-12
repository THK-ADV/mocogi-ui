import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { arrayToObject } from '../../ops/array-to-object'
import {
  OptionsInput,
  OptionsInputComponent,
} from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  validMandatoryCommaSeparatedNumber,
  validMandatoryObject,
} from './callback-validation'
import { POMandatory } from '../../types/pos'
import {
  showRecommendedSemester,
  showStudyProgram,
} from '../../ops/show.instances'
import { StudyProgram } from '../../types/module-compendium'
import { isStudyProgram } from '../../helper/study-program.helper'

export class PoMandatoryCallback
  implements MultipleEditDialogComponentCallback<POMandatory, StudyProgram>
{
  readonly all: { [id: string]: StudyProgram } = {}
  readonly selected: { [id: string]: POMandatory } = {}

  constructor(
    all: Readonly<StudyProgram[]>,
    selected: Readonly<POMandatory[]>,
  ) {
    this.all = arrayToObject(all, this.fullPoIdSp)
    this.selected = arrayToObject(selected, this.fullPoIdPo)
  }

  filterInitialOptionsForComponent(
    optionsInput: OptionsInput<StudyProgram>,
  ): StudyProgram[] {
    const data = optionsInput.data
    if (!Array.isArray(data)) {
      return []
    }
    if (optionsInput.attr === 'po') {
      return data.filter((d) => !this.selected[this.fullPoIdSp(d)])
    }
    return data
  }

  addOptionToOptionsInputComponent(
    option: POMandatory,
    components: QueryList<OptionsInputComponent<unknown>>,
  ): void {
    const studyProgram = this.lookup(option)
    const component = components.find((_) => _.input.attr === 'po')
    if (studyProgram && component) {
      component.addOption(studyProgram)
    }
    component?.reset()
  }

  removeOptionFromOptionsInputComponent(
    option: POMandatory,
    components: QueryList<OptionsInputComponent<unknown>>,
  ): void {
    const studyProgram = this.lookup(option)
    const component = components.find((_) => _.input.attr === 'po')
    if (studyProgram && component) {
      component.removeOption(studyProgram)
    }
    component?.reset()
  }

  tableContent(tableEntry: POMandatory, attr: string): string {
    switch (attr) {
      case 'po':
        const studyProgram = this.lookup(tableEntry)
        return studyProgram ? showStudyProgram(studyProgram) : tableEntry.po
      case 'recommended-semester':
        return showRecommendedSemester(tableEntry.recommendedSemester)
      default:
        return '???'
    }
  }

  tableEntryAlreadyExists(controls: {
    [key: string]: FormControl
  }): (p: POMandatory) => boolean {
    const sp = this.getStudyProgramValue(controls)
    return ({ po, specialization }) => isStudyProgram(sp, po, specialization)
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

  onValidate(_controls: { [key: string]: FormControl }): void {}

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    return (
      !this.validPO(controls['po'].value) ||
      !this.validRecommendedSemester(controls['recommended-semester'].value)
    )
  }

  private validPO = (value: unknown) => validMandatoryObject(value)

  private validRecommendedSemester = (value: unknown) =>
    validMandatoryCommaSeparatedNumber(value)

  private getRecommendedSemesterValue = (controls: {
    [p: string]: FormControl
  }) =>
    (controls['recommended-semester'].value as string)
      .split(',')
      .map((a) => Number(a))

  private getStudyProgramValue = (controls: { [p: string]: FormControl }) =>
    controls['po'].value as StudyProgram

  private lookup = (po: POMandatory): StudyProgram | undefined =>
    this.all[this.fullPoIdPo(po)]

  private fullPoIdSp = (studyProgram: StudyProgram) =>
    studyProgram.specialization?.id ?? studyProgram.po.id

  private fullPoIdPo = (po: POMandatory) => po.specialization ?? po.po
}
