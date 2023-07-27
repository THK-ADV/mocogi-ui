import { MetadataAtomic } from '../../state/selectors/module.selectors'
import { fullStudyProgramOrd } from '../../ops/ordering.instances'
import { showFullStudyProgram, showPerson, showRecommendedSemester } from '../../ops/show.instances'
import { SelectedStudyProgramId } from '../../state/reducer/module-filter.reducer'

export type ModuleTableRepresentation = {
  id: string
  title: string
  abbrev: string
  coordinator: string
  ects: string
  semester: string
  pos: string[]
  isSpecialization: boolean
}

export function toTableRepresentation(metadata: MetadataAtomic, selectedStudyProgramId?: SelectedStudyProgramId): ModuleTableRepresentation {
  return {
    id: metadata.id,
    title: metadata.title,
    abbrev: metadata.abbrev,
    coordinator: formatCoordinator(metadata),
    ects: metadata.ects.toLocaleString(),
    semester: formatSemester(metadata, selectedStudyProgramId),
    pos: !selectedStudyProgramId ? formatPOs(metadata) : [],
    isSpecialization: metadata.po.mandatory.some(a => a.specialization),
  }
}

function formatCoordinator(metadata: MetadataAtomic): string {
  return metadata.moduleManagement
    .map(showPerson)
    .join('; ')
}

function formatSemester(metadata: MetadataAtomic, selectedStudyProgramId?: SelectedStudyProgramId): string {
  let semester: number[]
  if (selectedStudyProgramId) {
    semester = metadata.po.mandatory
      .find(po => po.po === selectedStudyProgramId.poId)?.recommendedSemester ?? [] // TODO adapt to specialization?
  } else {
    const res: Record<number, undefined> = {}
    metadata.po.mandatory.forEach(po => {
      po.recommendedSemester.forEach(n => res[n] = undefined)
    })
    semester = Object.keys(res).map(s => +s)
  }
  return showRecommendedSemester(semester)
}

function formatPOs(metadata: MetadataAtomic): string[] {
  return [...metadata.poMandatoryAtomic]
    .sort((a, b) => fullStudyProgramOrd(a.po, b.po))
    .map(({po, recommendedSemester}) => {
      return recommendedSemester.length === 0
        ? showFullStudyProgram(po)
        : `${showFullStudyProgram(po)} (Semester ${showRecommendedSemester([...recommendedSemester])})`
    })
}
