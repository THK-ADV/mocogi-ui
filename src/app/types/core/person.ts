import { Faculty } from './faculty'

export type Person = DefaultPerson | UnknownPerson | GroupPerson

export interface DefaultPerson {
  id: string
  lastname: string
  firstname: string
  title: string
  faculties: Faculty[]
  abbreviation: string
  campusId: string
  status: PersonStatus
  kind: 'default'
}

export interface UnknownPerson {
  id: string
  label: string
  kind: 'unknown'
}

export interface GroupPerson {
  id: string
  label: string
  kind: 'group'
}

export interface PersonStatus {
  deLabel: string
  enLabel: string
}
