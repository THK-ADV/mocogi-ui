import { Faculty } from './faculty'

export type Identity = Person | UnknownIdentity | Group

export interface Person {
  id: string
  lastname: string
  firstname: string
  title: string
  faculties: Faculty[]
  abbreviation: string
  campusId: string
  status: PersonStatus
  kind: 'person'
}

export interface PersonStatus {
  deLabel: string
  enLabel: string
}

export interface UnknownIdentity {
  id: string
  label: string
  kind: 'unknown'
}

export interface Group {
  id: string
  label: string
  kind: 'group'
}
