import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { ElectivesCatalogue } from '../../../types/electivesCatalogues'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'cops-elective-modules-lists-list',
  templateUrl: './elective-modules-lists-list.component.html',
  styleUrls: ['./elective-modules-lists-list.component.css'],
  standalone: false,
})
export class ElectiveModulesListsListComponent {
  protected dataSource = new MatTableDataSource<ElectivesCatalogue>()
  protected displayedColumns: string[] = ['title', 'semester', 'download_de']

  @Input() set electiveModulesList(
    electiveModulesList: ReadonlyArray<ElectivesCatalogue> | null,
  ) {
    if (electiveModulesList) {
      this.dataSource.data = [...electiveModulesList]
    }
  }

  absoluteUrl = (url: string) => `${environment.backendUrl}/${url}`
}
