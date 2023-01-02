import { Module } from '../../http/http.service'
import { SingleEntryCallback } from './single-entry-callback'

export class ModuleCallback extends SingleEntryCallback<Module> {
  constructor(all: Readonly<Module[]>, selected: Readonly<Module[]>, attr: string, show: (m: Module) => string) {
    super(all, selected, attr, m => m.id, show)
  }
}
