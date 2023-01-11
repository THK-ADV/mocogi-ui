import { SingleEntryCallback } from './single-entry-callback'
import { POPreview } from '../../types/pos'

export class PrerequisitesPoCallback extends SingleEntryCallback<POPreview> {
  constructor(all: Readonly<POPreview[]>, selected: Readonly<POPreview[]>, attr: string, show: (p: POPreview) => string) {
    super(all, selected, attr, p => p.id, show)
  }
}
