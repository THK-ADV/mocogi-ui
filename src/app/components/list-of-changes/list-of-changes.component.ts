import { Component, Input } from '@angular/core'

type ChangedKeys = {
  icon: string
  name: string
  details: string
  toBeReviewed: boolean
}

@Component({
  selector: 'cops-list-of-changes',
  templateUrl: './list-of-changes.component.html',
  styleUrls: ['./list-of-changes.component.css'],
  standalone: false,
})
export class ListOfChangesComponent {
  @Input() changedKeys!: ReadonlyArray<ChangedKeys>
  jumpTo(key: string) {
    return key
  }
}
