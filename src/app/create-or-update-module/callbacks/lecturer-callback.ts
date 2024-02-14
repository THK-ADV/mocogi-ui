import { SingleEntryCallback } from './single-entry-callback'
import { Identity } from '../../types/core/person'

export class LecturerCallback extends SingleEntryCallback<Identity> {
  constructor(all: Readonly<Identity[]>, selected: Readonly<Identity[]>, attr: string, show: (m: Identity) => string) {
    super(all, selected, attr, p => p.id, show)
  }
}
