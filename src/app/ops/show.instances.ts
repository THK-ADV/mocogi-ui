import { Identity } from '../types/core/person'
import { Label } from '../types/core/label'
import { ModuleCore } from '../types/moduleCore'
import { Show } from './show'

import { StudyProgramView } from '../types/study-program-view'
import { PersonShort } from '../types/module-view'

export const showPerson: Show<Identity> = p => {
  switch (p.kind) {
    case 'person':
      return `${p.lastname}, ${p.firstname}`
    case 'group':
      return p.label
    case 'unknown':
      return p.label
  }
}
export const showPersonShort: Show<PersonShort> = p =>
  p.kind === 'person' ? `${p.lastname}, ${p.firstname}` : p.title

// TODO temporary fix for handling 'flex issue'. see: https://git.st.archi-lab.io/adobryni/modulhandbuecher_test/-/issues/3
export const showStudyProgramAtomic: Show<StudyProgramView> = (
  {
    studyProgram,
    poId,
    poVersion,
    degree,
    specialization,
  },
) => {
  if (specialization) { // TODO refactor
    return poId.endsWith('flex')
      ? `${studyProgram.deLabel}-Flex ${specialization.deLabel} (${degree} - PO ${poVersion})`
      : `${studyProgram.deLabel} ${specialization.deLabel} (${degree} - PO ${poVersion})`
  } else {
    return poId.endsWith('flex')
      ? `${studyProgram.deLabel}-Flex (${degree} - PO ${poVersion})`
      : `${studyProgram.deLabel} (${degree} - PO ${poVersion})`
  }
}

export const showLabel: Show<Label> = label => label.deLabel

export const showModule: Show<ModuleCore> = module => module.title


export const showRecommendedSemester: Show<number[]> = semesters =>
  semesters.length === 0 ? '-' : [...semesters].sort().join(', ')
