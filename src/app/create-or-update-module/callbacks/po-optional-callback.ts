import { MultipleEditDialogComponentCallback } from '../../form/multiple-edit-dialog/multiple-edit-dialog.component'
import { arrayToObject } from '../../ops/array-to-object'
import {
  OptionsInput,
  OptionsInputComponent,
} from '../../form/options-input/options-input.component'
import { QueryList } from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  validMandatoryBoolean,
  validMandatoryCommaSeparatedNumber,
  validMandatoryObject,
} from './callback-validation'
import { POOptional } from '../../types/pos'
import {
  showRecommendedSemester,
  showStudyProgram,
} from '../../ops/show.instances'
import { StudyProgram } from '../../types/module-compendium'
import { GenericModuleCore } from '../../types/genericModuleCore'

export class PoOptionalCallback
  implements MultipleEditDialogComponentCallback<POOptional, StudyProgram>
{
  readonly all: Readonly<StudyProgram[]>
  readonly selected: Readonly<POOptional[]>
  readonly genericModules: { [id: string]: GenericModuleCore } = {}

  constructor(
    all: Readonly<StudyProgram[]>,
    selected: Readonly<POOptional[]>,
    genericModules: Readonly<GenericModuleCore>[],
  ) {
    this.all = all
    this.selected = selected
    this.genericModules = arrayToObject(genericModules, (a) => a.id)
  }

  isSamePOEntry(sp: StudyProgram, poOptional: POOptional): boolean {
    const samePO = sp.po.id === poOptional.po
    if (sp.specialization && poOptional.specialization) {
      return samePO && sp.specialization.id === poOptional.specialization
    }
    return samePO
  }

  filterInitialOptionsForComponent(
    optionsInput: OptionsInput<StudyProgram>,
  ): StudyProgram[] {
    const data = optionsInput.data
    if (!Array.isArray(data)) {
      return []
    }
    if (optionsInput.attr === 'po') {
      return data.filter(
        (sp) => !this.selected.some((po) => this.isSamePOEntry(sp, po)),
      )
    }
    return data
  }

  addOptionToOptionsInputComponent(
    option: POOptional,
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
    option: POOptional,
    components: QueryList<OptionsInputComponent<unknown>>,
  ): void {
    const studyProgram = this.lookup(option)
    const component = components.find((_) => _.input.attr === 'po')
    if (studyProgram && component) {
      component.removeOption(studyProgram)
    }
    component?.reset()
  }

  tableContent(tableEntry: POOptional, attr: string): string {
    switch (attr) {
      case 'po':
        return this.lookupLabel(tableEntry)
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

  tableEntryAlreadyExists(controls: {
    [key: string]: FormControl
  }): (e: POOptional) => boolean {
    const studyProgram = this.getStudyProgramValue(controls)
    return (po) => this.isSamePOEntry(studyProgram, po)
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

  onValidate(_controls: { [key: string]: FormControl }): void {}

  isCreateButtonDisabled(controls: { [key: string]: FormControl }): boolean {
    const isValidPO = this.validPO(controls['po'].value)
    const isValidInstanceOf = this.validInstanceOf(
      controls['instance-of'].value,
    )
    let isMatchingPO = false

    if (isValidPO && isValidInstanceOf) {
      const { po } = this.getStudyProgramValue(controls)
      const { pos } = this.getInstanceOfValue(controls)
      isMatchingPO = pos.some((p) => po.id === p)
      if (!isMatchingPO) {
        const error = {
          nonMatchingPO: $localize`Studiengang stimmt nicht mit gewählter Instanz überein`,
        }
        controls['po'].setErrors(error, { emitEvent: true })
        controls['instance-of'].setErrors(error, { emitEvent: true })
      } else {
        controls['po'].setErrors(null, { emitEvent: true })
        controls['instance-of'].setErrors(null, { emitEvent: true })
      }
    }

    const isInvalid =
      !isValidPO ||
      !isValidInstanceOf ||
      !this.validPartOfCatalog(controls['part-of-catalog'].value) ||
      !this.validRecommendedSemester(controls['recommended-semester'].value)

    return isInvalid || !isMatchingPO
  }

  private validPO = (value: unknown) =>
    validMandatoryObject(value) && typeof value === 'object'

  private validInstanceOf = (value: unknown) =>
    validMandatoryObject(value) && typeof value === 'object'

  private validPartOfCatalog = (value: unknown) => validMandatoryBoolean(value)

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

  private getInstanceOfValue = (controls: { [p: string]: FormControl }) =>
    controls['instance-of'].value as GenericModuleCore

  private getPartOfCatalogValue = (controls: { [p: string]: FormControl }) =>
    controls['part-of-catalog'].value as boolean

  private lookup = (option: POOptional): StudyProgram | undefined =>
    this.all.find((sp) => this.isSamePOEntry(sp, option))

  private lookupLabel = (po: POOptional): string => {
    const sp = this.lookup(po)
    return sp ? showStudyProgram(sp) : po.po
  }
}
