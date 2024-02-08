import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { ElectivesCatalogue } from "../../../types/electivesCatalogues";

@Component({
  selector: 'cops-elective-modules-lists-list',
  templateUrl: './elective-modules-lists-list.component.html',
  styleUrls: ['./elective-modules-lists-list.component.css'],
})
export class ElectiveModulesListsListComponent {
  protected dataSource = new MatTableDataSource<ElectivesCatalogue>()
  protected displayedColumns: string[] = ['title', 'study_program', 'po', 'download_de', 'download_en']

  @Input() set electiveModulesList(electiveModulesList: ReadonlyArray<ElectivesCatalogue> | null) {
    if (electiveModulesList) {
      this.dataSource.data = [...electiveModulesList]
    }
  }
}
