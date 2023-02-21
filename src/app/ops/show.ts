import { Label } from '../types/core/label'
import { Module } from '../types/module'
import { Person } from '../types/core/person'

export type Show<A> = (a: A) => string

export namespace Show {
  export const person: Show<Person> = p => {
    switch (p.kind) {
      case 'single':
        return `${p.lastname}, ${p.firstname}`
      case 'group':
        return p.title
      case 'unknown':
        return p.title
    }
  }

  export const label: Show<Label> = label =>
    label.deLabel

  export const module: Show<Module> = module =>
    module.title
}
