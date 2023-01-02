import { SingleEntryCallback } from './single-entry-callback'
import { Module, POPreview } from '../../http/http.service'

export class PoCallback extends SingleEntryCallback<POPreview> {
  constructor(all: Readonly<POPreview[]>, selected: Readonly<POPreview[]>, attr: string, show: (p: POPreview) => string) {
    super(all, selected, attr, p => p.id, show)
  }
}
