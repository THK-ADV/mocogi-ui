import { showRecommendedSemester, showStudyProgramAtomic } from '../../ops/show.instances'
import { SelectedStudyProgramId } from '../../state/reducer/module-filter.reducer'
import { ModuleView, StudyProgramModuleAssociation } from '../../types/module-view'
import { stringOrd } from '../../ops/ordering.instances'
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
    isSpecialization: module.studyProgram.some(s => s.specialization),
    moduleManagementStr: module.moduleManagement.map((moduleManager) => `${moduleManager.title} ${moduleManager.firstname} ${moduleManager.lastname}`).join('; '),
    recommendedSemesterStr: formatSemester(module, selectedStudyProgramId),
    studyProgramsStr: () => !selectedStudyProgramId ? formatStudyPrograms([...module.studyProgram]) : [],
  }
}

function formatSemester(module: ModuleView, selectedStudyProgramId?: SelectedStudyProgramId): string {
  let semester: number[]
  if (selectedStudyProgramId) {
    semester = module.studyProgram
      .find(sp => sp.poId === selectedStudyProgramId.poId)?.recommendedSemester ?? [] // TODO adapt to specialization?
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
  Ordering.contraMap(stringOrd, ({poId}) => poId),
  Ordering.contraMap(stringOrd, ({degree}) => degree),
])

function formatStudyPrograms(studyPrograms: StudyProgramModuleAssociation[]): string[] {
  return studyPrograms.sort(studyProgramAtomicOrd)
    .map(sp => {
      return sp.recommendedSemester.length === 0
        ? showStudyProgramAtomic(sp)
        : `${showStudyProgramAtomic(sp)} (Semester ${showRecommendedSemester(sp.recommendedSemester)})`
    })
}
