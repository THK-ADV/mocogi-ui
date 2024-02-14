import { showRecommendedSemester, showStudyProgram } from '../../ops/show.instances'
import { SelectedStudyProgramId } from '../../state/reducer/module-filter.reducer'
import { ModuleView, StudyProgramModuleAssociation } from '../../types/module-view'
import { numberOrd, stringOrd } from '../../ops/ordering.instances'
import { Ordering } from '../../ops/ordering'

export type ModuleTableEntry = ModuleView & {
  isSpecialization: boolean,
  moduleManagementStr: string,
  recommendedSemesterStr: string,
  studyProgramsStr: () => ReadonlyArray<string>
}

export function toModuleTableEntry(module: ModuleView, selectedStudyProgramId?: SelectedStudyProgramId): ModuleTableEntry {
  return {
    ...module,
    isSpecialization: module.studyProgram.some(association => association.studyProgram.specialization),
    moduleManagementStr: module.moduleManagement.map((moduleManager) => `${moduleManager.title} ${moduleManager.firstname} ${moduleManager.lastname}`).join('; '),
    recommendedSemesterStr: formatSemester(module, selectedStudyProgramId),
    studyProgramsStr: () => !selectedStudyProgramId ? formatStudyPrograms([...module.studyProgram]) : [],
  }
}

function formatSemester(module: ModuleView, selectedStudyProgramId?: SelectedStudyProgramId): string {
  let semester: number[]
  if (selectedStudyProgramId) {
    semester = module.studyProgram
      .find(association => association.studyProgram.po.id === selectedStudyProgramId.poId)?.recommendedSemester ?? [] // TODO adapt to specialization?
  } else {
    const res: Record<number, undefined> = {}
    module.studyProgram.forEach(sp => {
      sp.recommendedSemester.forEach(n => res[n] = undefined)
    })
    semester = Object.keys(res).map(s => +s)
  }
  return showRecommendedSemester(semester)
}

const studyProgramAtomicOrd = Ordering.many<StudyProgramModuleAssociation>([
  Ordering.contraMap(stringOrd, ({studyProgram}) => studyProgram.deLabel),
  Ordering.contraMap(numberOrd, ({studyProgram}) => studyProgram.po.version),
  Ordering.contraMap(stringOrd, ({studyProgram}) => studyProgram.degree.deLabel),
])

function formatStudyPrograms(assoociations: StudyProgramModuleAssociation[]): string[] {
  return assoociations.sort(studyProgramAtomicOrd)
    .map(association => {
      return association.recommendedSemester.length === 0
        ? showStudyProgram(association.studyProgram)
        : `${showStudyProgram(association.studyProgram)} (Semester ${showRecommendedSemester(association.recommendedSemester)})`
    })
}
