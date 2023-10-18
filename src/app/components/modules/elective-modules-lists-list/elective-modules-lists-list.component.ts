import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'

export type ElectiveModulesList = {
  title: string,
  semester: string,
  studyProgram: string,
  po: string,
  englishDownloadLink: string,
  germanDownloadLink: string,
}

@Component({
  selector: 'cops-elective-modules-lists-list',
  templateUrl: './elective-modules-lists-list.component.html',
  styleUrls: ['./elective-modules-lists-list.component.css'],
})
export class ElectiveModulesListsListComponent {
  protected dataSource = new MatTableDataSource<ElectiveModulesList>()
  protected displayedColumns: string[] = ['title', 'study_program', 'po', 'download_de', 'download_en']

  @Input() set electiveModulesList(electiveModulesList: ReadonlyArray<ElectiveModulesList> | null) {
    if (electiveModulesList) {
      this.dataSource.data = [...electiveModulesList]
    }
  }
}
