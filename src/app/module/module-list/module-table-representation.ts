import { MetadataWithCoordinators } from '../../state/selectors/module.selectors'
import { Show } from '../../ops/show'

export type ModuleTableRepresentation = {
  id: string,
  title: string,
  abbrev: string,
  coordinator: string,
  ects: string,
  semester: string,
  pos: string[]
}

export function toTableRepresentation(metadataWithCoordinators: MetadataWithCoordinators, selectedPOId?: string): ModuleTableRepresentation {
  return {
    id: metadataWithCoordinators.id,
    title: metadataWithCoordinators.title,
    abbrev: metadataWithCoordinators.abbrev,
    coordinator: formatCoordinator(metadataWithCoordinators),
    ects: metadataWithCoordinators.ects.toLocaleString(),
    semester: formatSemester(metadataWithCoordinators, selectedPOId),
    pos: selectedPOId ? formatPOs(metadataWithCoordinators) : []
  }
}

function formatCoordinator(metadataWithCoordinators: MetadataWithCoordinators): string {
  return metadataWithCoordinators.moduleManagement
    .map(Show.person)
    .join('; ')
}


function formatSemester(metadataWithCoordinators: MetadataWithCoordinators, selectedPO?: string): string {
  let semester: string[] | number[]
  if (selectedPO) {
    semester = metadataWithCoordinators.po.mandatory.find(po => po.po === selectedPO)?.recommendedSemester ?? []
  } else {
    const res: Record<number, undefined> = {}
    metadataWithCoordinators.po.mandatory.forEach(po => {
      po.recommendedSemester.forEach(n => res[n] = undefined)
    })
    semester = Object.keys(res)
  }
  return semester.sort().join(', ')
}

function formatPOs(metadataWithCoordinators: MetadataWithCoordinators): string[] {
  return metadataWithCoordinators.po.mandatory.map(po => {
    return `${po.po} (Semester ${po.recommendedSemester.sort().join(', ')})`
  })
}
