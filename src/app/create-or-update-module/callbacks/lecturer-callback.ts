import { SingleEntryCallback } from './single-entry-callback'
import { Person } from '../../types/core/person'

export class LecturerCallback extends SingleEntryCallback<Person> {
  constructor(all: Readonly<Person[]>, selected: Readonly<Person[]>, attr: string, show: (m: Person) => string) {
    super(all, selected, attr, p => p.id, show)
  }
}
