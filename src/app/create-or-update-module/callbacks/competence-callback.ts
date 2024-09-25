import { SingleEntryCallback } from './single-entry-callback'
import { Competence } from '../../types/core/competence'

export class CompetenceCallback extends SingleEntryCallback<Competence> {
  constructor(
    all: Readonly<Competence[]>,
    selected: Readonly<Competence[]>,
    attr: string,
    show: (m: Competence) => string,
  ) {
    super(all, selected, attr, (p) => p.id, show)
  }
}
