import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'

export type ModuleCompendiumList = {
  title: string,
  semester: string,
  studyProgram: string,
  po: string,
  englishDownloadLink: string,
  germanDownloadLink: string,
}

@Component({
  selector: 'cops-module-compendium-lists-list',
  templateUrl: './module-compendium-lists-list.component.html',
  styleUrls: ['./module-compendium-lists-list.component.css'],
})
export class ModuleCompendiumListsListComponent {
  protected dataSource = new MatTableDataSource<ModuleCompendiumList>()
  protected displayedColumns: string[] = ['title', 'study_program', 'po', 'download_de', 'download_en']

  @Input() set moduleCompendiumList(moduleCompendiumList: ReadonlyArray<ModuleCompendiumList> | null) {
    if (moduleCompendiumList) {
      this.dataSource.data = [...moduleCompendiumList]
    }
  }
}
