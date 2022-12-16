import { Component, OnDestroy, OnInit } from '@angular/core'
import { HttpService, Metadata } from '../http/http.service'
import { Subscription } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table'

interface TableHeaderColumn {
  title: string
  attr: string
}

@Component({
  selector: 'sched-own-modules',
  templateUrl: './own-modules.component.html',
  styleUrls: ['./own-modules.component.scss']
})
export class OwnModulesComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<Metadata>
  columns: TableHeaderColumn[]
  displayedColumns: string[]
  headerTitle = 'Meine Module'
  tooltipTitle = 'Modul erstellen'
  sub?: Subscription

  constructor(private readonly http: HttpService) {
    this.dataSource = new MatTableDataSource<Metadata>()
    this.columns = [{title: 'Name', attr: 'name'}]
    this.displayedColumns = this.columns.map(_ => _.attr)
    this.displayedColumns.push('action')
  }

  ngOnInit() {
    this.sub = this.http.allMetadataForUser('cko')
      .subscribe(xs => this.dataSource.data = xs)
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
  }

  onEdit = (m: Metadata) => {
  }

  onSelect = (m: Metadata) => {

  }

  onCreate = () => {

  }

  tableContent = (m: Metadata, attr: string): string => {
    switch (attr) {
      case 'name':
        return m.title
      default:
        return '???'
    }
  }
}
