import { Person } from '../types/core/person'
import { Label } from '../types/core/label'
import { Module } from '../types/module'
import { Show } from './show'

import { StudyProgramAtomic } from '../types/study-program-atomic'
import { PersonShort } from '../types/module-atomic'

export const showPerson: Show<Person> = p => {
  switch (p.kind) {
    case 'default':
      return `${p.lastname}, ${p.firstname}`
    case 'group':
      return p.label
    case 'unknown':
      return p.label
  }
}
export const showPersonShort: Show<PersonShort> = p =>
  p.kind === 'default' ? `${p.lastname}, ${p.firstname}` : p.title

// TODO temporary fix for handling 'flex issue'. see: https://git.st.archi-lab.io/adobryni/modulhandbuecher_test/-/issues/3
export const showStudyProgramAtomic: Show<StudyProgramAtomic> = (
  {
    studyProgramLabel,
    poAbbrev,
    grade,
    version,
    specialization,
  },
) => {
  if (specialization) { // TODO refactor
    return poAbbrev.endsWith('flex')
      ? `${studyProgramLabel}-Flex ${specialization.label} (${grade} - PO ${version})`
      : `${studyProgramLabel} ${specialization.label} (${grade} - PO ${version})`
  } else {
    return poAbbrev.endsWith('flex')
      ? `${studyProgramLabel}-Flex (${grade} - PO ${version})`
      : `${studyProgramLabel} (${grade} - PO ${version})`
  }
}

export const showLabel: Show<Label> = label => {
  return label.deLabel
}

export const showModule: Show<Module> = module =>
  module.title

export const showRecommendedSemester: Show<number[]> = semesters =>
  semesters.length === 0 ? '-' : [...semesters].sort().join(', ')
