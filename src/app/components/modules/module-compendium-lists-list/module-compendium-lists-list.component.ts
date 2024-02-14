import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { ModuleCatalog } from '../../../types/module-compendium'
import { environment } from '../../../../environments/environment'
import { Ordering } from '../../../ops/ordering'
import { numberOrd, stringOrd } from '../../../ops/ordering.instances'

@Component({
  selector: 'cops-module-compendium-lists-list',
  templateUrl: './module-compendium-lists-list.component.html',
  styleUrls: ['./module-compendium-lists-list.component.css'],
})
export class ModuleCompendiumListsListComponent {
  protected dataSource = new MatTableDataSource<ModuleCatalog>()
  protected displayedColumns: string[] = ['title', 'study_program', 'po', 'download_de', 'download_en']

  private ord = Ordering.many<ModuleCatalog>([
    Ordering.contraMap(stringOrd, mc => mc.studyProgram.id),
    Ordering.contraMap(stringOrd, mc => mc.studyProgram.degree.id),
    Ordering.contraMap(numberOrd, mc => mc.studyProgram.po.version),
  ])

  @Input() set moduleCatalogs(moduleCatalogs: ReadonlyArray<ModuleCatalog> | null) {
    if (moduleCatalogs) {
      this.dataSource.data = [...moduleCatalogs].sort(this.ord)
    }
  }

  absoluteUrl = (url: string) =>
    `${environment.backendUrl}/${url}`
}
