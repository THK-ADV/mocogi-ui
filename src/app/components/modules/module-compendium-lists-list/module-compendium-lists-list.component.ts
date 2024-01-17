import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { ModuleCompendiumList } from '../../../types/module-compendium-list'
import { environment } from '../../../../environments/environment'
import { Ordering } from '../../../ops/ordering'
import { numberOrd, stringOrd } from '../../../ops/ordering.instances'

@Component({
  selector: 'cops-module-compendium-lists-list',
  templateUrl: './module-compendium-lists-list.component.html',
  styleUrls: ['./module-compendium-lists-list.component.css'],
})
export class ModuleCompendiumListsListComponent {
  protected dataSource = new MatTableDataSource<ModuleCompendiumList>()
  protected displayedColumns: string[] = ['title', 'study_program', 'po', 'download_de', 'download_en']

  private ord = Ordering.many<ModuleCompendiumList>([
    Ordering.contraMap(stringOrd, a => a.poAbbrev),
    Ordering.contraMap(stringOrd, a => a.studyProgram.grade.abbrev),
    Ordering.contraMap(numberOrd, a => a.poNumber),
  ])

  @Input() set moduleCompendiumList(moduleCompendiumList: ReadonlyArray<ModuleCompendiumList> | null) {
    if (moduleCompendiumList) {
      this.dataSource.data = [...moduleCompendiumList].sort(this.ord)
    }
  }

  absoluteUrl = (url: string) =>
    `${environment.backendUrl}/${url}`

  // TODO i hate this workaround...
  studyProgramLabel = ({poAbbrev, studyProgram}: ModuleCompendiumList) =>
    poAbbrev.endsWith('flex') ? `${studyProgram.deLabel}-Flex` : studyProgram.deLabel
}
