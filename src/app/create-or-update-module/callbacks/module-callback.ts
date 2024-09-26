import { SingleEntryCallback } from './single-entry-callback'
import { ModuleCore } from '../../types/moduleCore'

export class ModuleCallback extends SingleEntryCallback<ModuleCore> {
  constructor(
    all: Readonly<ModuleCore[]>,
    selected: Readonly<ModuleCore[]>,
    attr: string,
    show: (m: ModuleCore) => string,
  ) {
    super(all, selected, attr, (m) => m.id, show)
  }
}
