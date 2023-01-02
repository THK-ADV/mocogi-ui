import { Person } from '../../http/http.service'
import { SingleEntryCallback } from './single-entry-callback'

export class LecturerCallback extends SingleEntryCallback<Person> {
  constructor(all: Readonly<Person[]>, selected: Readonly<Person[]>, attr: string, show: (m: Person) => string) {
    super(all, selected, attr, p => p.id, show)
  }
}
