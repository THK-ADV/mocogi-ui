import { Person } from '../types/core/person'
import { FullStudyProgram } from '../state/selectors/module-filter.selectors'
import { Label } from '../types/core/label'
import { Module } from '../types/module'
import { Show } from './show'

export const showPerson: Show<Person> = p => {
  switch (p.kind) {
    case 'single':
      return `${p.lastname}, ${p.firstname}`
    case 'group':
      return p.title
    case 'unknown':
      return p.title
  }
}

// TODO temporary fix for handling 'flex issue'. see: https://git.st.archi-lab.io/adobryni/modulhandbuecher_test/-/issues/3
export const showFullStudyProgram: Show<FullStudyProgram> = (
  {
    studyProgram,
    po,
    grade,
    specialization
  }
) => {
  if (specialization) { // TODO refactor
    return po.abbrev.endsWith('flex')
      ? `${studyProgram.deLabel}-Flex ${specialization.label} (${grade.deLabel} - PO ${po.version})`
      : `${studyProgram.deLabel} ${specialization.label} (${grade.deLabel} - PO ${po.version})`
  } else {
    return po.abbrev.endsWith('flex')
      ? `${studyProgram.deLabel}-Flex (${grade.deLabel} - PO ${po.version})`
      : `${studyProgram.deLabel} (${grade.deLabel} - PO ${po.version})`
  }
}

export const showLabel: Show<Label> = label =>
  label.deLabel

export const showModule: Show<Module> = module =>
  module.title

export const showRecommendedSemester: Show<number[]> = semesters =>
  semesters.length === 0 ? '-' : [...semesters].sort().join(', ')
