import { Component, OnDestroy, OnInit } from '@angular/core'
import { HttpService, MetadataPreview } from '../http/http.service'
import { Subscription } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router'

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

  dataSource: MatTableDataSource<MetadataPreview>
  columns: TableHeaderColumn[]
  displayedColumns: string[]
  headerTitle = 'Meine Module'
  tooltipTitle = 'Modul erstellen'
  sub?: Subscription

  constructor(private readonly http: HttpService, private readonly router: Router) {
    this.dataSource = new MatTableDataSource<MetadataPreview>()
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

  onEdit = (m: MetadataPreview) =>
    this.router.navigate(['/edit'], {state: {id: m.id}, queryParams: {action: 'update'}})

  onSelect = (m: MetadataPreview) => {

  }

  onCreate = () =>
    this.router.navigate(['/edit'], {queryParams: {action: 'create'}})

  tableContent = (m: MetadataPreview, attr: string): string => {
    switch (attr) {
      case 'name':
        return m.title
      default:
        return '???'
    }
  }
}
