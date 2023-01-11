import { Faculty } from './faculty'

export type Person = SinglePerson | UnknownPerson | GroupPerson

export interface SinglePerson {
  id: string
  lastname: string
  firstname: string
  title: string
  faculties: Faculty[]
  abbreviation: string
  status: PersonStatus
  kind: 'single'
}

export interface UnknownPerson {
  id: string
  title: string
  kind: 'unknown'
}

export interface GroupPerson {
  id: string
  title: string
  kind: 'group'
}

export interface PersonStatus {
  deLabel: string
  enLabel: string
}
