import { showPersonShort, showRecommendedSemester, showStudyProgramAtomic } from '../../ops/show.instances'
import { SelectedStudyProgramId } from '../../state/reducer/module-filter.reducer'
import { ModuleAtomic, StudyProgramModuleAssociation } from '../../types/module-atomic'
import { stringOrd } from '../../ops/ordering.instances'
import { Ordering } from '../../ops/ordering'

export type ModuleTableEntry = ModuleAtomic & {
  isSpecialization: boolean,
  moduleManagementStr: string,
  recommendedSemesterStr: string,
  studyProgramsStr: () => ReadonlyArray<string>
}

export function toModuleTableEntry(module: ModuleAtomic, selectedStudyProgramId?: SelectedStudyProgramId): ModuleTableEntry {
  return {
    ...module,
    isSpecialization: module.studyProgram.some(s => s.specialization),
    moduleManagementStr: module.moduleManagement.map(showPersonShort).join('; '),
    recommendedSemesterStr: formatSemester(module, selectedStudyProgramId),
    studyProgramsStr: () => !selectedStudyProgramId ? formatStudyPrograms([...module.studyProgram]) : [],
  }
}

function formatSemester(module: ModuleAtomic, selectedStudyProgramId?: SelectedStudyProgramId): string {
  let semester: number[]
  if (selectedStudyProgramId) {
    semester = module.studyProgram
      .find(sp => sp.poAbbrev === selectedStudyProgramId.poId)?.recommendedSemester ?? [] // TODO adapt to specialization?
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
  Ordering.contraMap(stringOrd, ({studyProgramLabel}) => studyProgramLabel),
  Ordering.contraMap(stringOrd, ({poAbbrev}) => poAbbrev),
  Ordering.contraMap(stringOrd, ({grade}) => grade),
])

function formatStudyPrograms(studyPrograms: StudyProgramModuleAssociation[]): string[] {
  return studyPrograms.sort(studyProgramAtomicOrd)
    .map(sp => {
      return sp.recommendedSemester.length === 0
        ? showStudyProgramAtomic(sp)
        : `${showStudyProgramAtomic(sp)} (Semester ${showRecommendedSemester(sp.recommendedSemester)})`
    })
}
