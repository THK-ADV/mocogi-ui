import { Identity } from '../types/core/person'
import { Label } from '../types/core/label'
import { ModuleCore } from '../types/moduleCore'
import { Show } from './show'
import { PersonShort } from '../types/module-view'
import { StudyProgram } from '../types/module-compendium'

export const showPerson: Show<Identity> = (p) => {
  switch (p.kind) {
    case 'person':
      return `${p.lastname}, ${p.firstname}`
    case 'group':
      return p.label
    case 'unknown':
      return p.label
  }
}
export const showPersonShort: Show<PersonShort> = (p) =>
  p.kind === 'person' ? `${p.lastname}, ${p.firstname}` : p.title

export const showStudyProgram: Show<StudyProgram> = (sp) => {
  if (sp.specialization) {
    return `${sp.deLabel} ${sp.specialization.deLabel} (${sp.degree.deLabel} - PO ${sp.po.version})`
  } else {
    return `${sp.deLabel} (${sp.degree.deLabel} - PO ${sp.po.version})`
  }
}

export const showLabel: Show<Label> = (label) => label.deLabel

export const showModule: Show<ModuleCore> = (module) => module.title

export const showRecommendedSemester: Show<number[]> = (semesters) =>
  semesters.length === 0 ? '-' : [...semesters].sort().join(', ')
