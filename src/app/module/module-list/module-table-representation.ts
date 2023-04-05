import { MetadataAtomic } from '../../state/selectors/module.selectors'
import { studyProgramWithPOOrd } from '../../ops/ordering.instances'
import { showPerson, showRecommendedSemester, showStudyProgramWithPo } from '../../ops/show.instances'

export type ModuleTableRepresentation = {
  id: string,
  title: string,
  abbrev: string,
  coordinator: string,
  ects: string,
  semester: string,
  pos: string[]
}

export function toTableRepresentation(metadata: MetadataAtomic, selectedPOId?: string): ModuleTableRepresentation {
  return {
    id: metadata.id,
    title: metadata.title,
    abbrev: metadata.abbrev,
    coordinator: formatCoordinator(metadata),
    ects: metadata.ects.toLocaleString(),
    semester: formatSemester(metadata, selectedPOId),
    pos: !selectedPOId ? formatPOs(metadata) : []
  }
}

function formatCoordinator(metadata: MetadataAtomic): string {
  return metadata.moduleManagement
    .map(showPerson)
    .join('; ')
}


function formatSemester(metadata: MetadataAtomic, selectedPO?: string): string {
  let semester: number[]
  if (selectedPO) {
    semester = metadata.po.mandatory.find(po => po.po === selectedPO)?.recommendedSemester ?? []
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
    .sort((a, b) => studyProgramWithPOOrd(a.po, b.po))
    .map(({po, recommendedSemester}) => {
      return recommendedSemester.length === 0
        ? showStudyProgramWithPo(po)
        : `${showStudyProgramWithPo(po)} (Semester ${showRecommendedSemester([...recommendedSemester])})`
    })
}
