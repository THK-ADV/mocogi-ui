import { SingleEntryCallback } from './single-entry-callback'
import { GlobalCriteria } from '../../types/core/global-criteria'

export class GlobalCriteriaCallback extends SingleEntryCallback<GlobalCriteria> {
  constructor(
    all: Readonly<GlobalCriteria[]>,
    selected: Readonly<GlobalCriteria[]>,
    attr: string,
    show: (m: GlobalCriteria) => string,
  ) {
    super(all, selected, attr, (p) => p.id, show)
  }
}
