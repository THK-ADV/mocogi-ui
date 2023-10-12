import { Component } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { ModeratedModule } from '../../../types/moderated.module'

@Component({
  selector: 'cops-elective-modules-lists-list',
  templateUrl: './elective-modules-lists-list.component.html',
  styleUrls: ['./elective-modules-lists-list.component.css'],
})
export class ElectiveModulesListsListComponent {
  protected dataSource = new MatTableDataSource<ModeratedModule>()
  protected displayedColumns: string[] = ['module', 'status', 'actions']
}
