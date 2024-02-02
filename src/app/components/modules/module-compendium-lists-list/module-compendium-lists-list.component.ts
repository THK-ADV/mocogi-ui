import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { ModuleCompendium } from '../../../types/module-compendium'
import { environment } from '../../../../environments/environment'
import { Ordering } from '../../../ops/ordering'
import { numberOrd, stringOrd } from '../../../ops/ordering.instances'

@Component({
  selector: 'cops-module-compendium-lists-list',
  templateUrl: './module-compendium-lists-list.component.html',
  styleUrls: ['./module-compendium-lists-list.component.css'],
})
export class ModuleCompendiumListsListComponent {
  protected dataSource = new MatTableDataSource<ModuleCompendium>()
  protected displayedColumns: string[] = ['title', 'study_program', 'po', 'download_de', 'download_en']

  private ord = Ordering.many<ModuleCompendium>([
    Ordering.contraMap(stringOrd, a => a.studyProgram.abbrev),
    Ordering.contraMap(stringOrd, a => a.studyProgram.grade.abbrev),
    Ordering.contraMap(numberOrd, a => a.poNumber),
  ])

  @Input() set moduleCompendiumList(moduleCompendiumList: ReadonlyArray<ModuleCompendium> | null) {
    if (moduleCompendiumList) {
      this.dataSource.data = [...moduleCompendiumList].sort(this.ord)
    }
  }

  absoluteUrl = (url: string) =>
    `${environment.backendUrl}/${url}`

  // TODO i hate this workaround...
  studyProgramLabel = ({poAbbrev, studyProgram}: ModuleCompendium) =>
    poAbbrev.endsWith('flex') ? `${studyProgram.deLabel}-Flex` : studyProgram.deLabel
}
