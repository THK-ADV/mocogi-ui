import { Component } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'

type Update = {
  module: string,
  status: Status,
}

type Status = {
  label: string,
  color: string,
}

const ModuleUpdateStatus = {
  'waitingForApproval': { label: 'Waiting for approval', color: 'secondary'},
  'waitingForPublication': { label: 'Will be published on 12.12.2023', color: 'primary'},
  'invalid': { label: 'Invalid draft', color: 'primary'},
  'validForReview': { label: 'Valid for publication', color: 'primary'},
  'validForPublication': { label: 'Valid for review', color: 'primary'},
  'published': { label: 'Published', color: 'primary'},
}

const rawData: Update[] = [
  { module: 'Beautiful Code', status: ModuleUpdateStatus.waitingForApproval },
  { module: 'Projektanteil Projekt 1', status: ModuleUpdateStatus.validForPublication },
  { module: 'Projektanteil Projekt 2', status: ModuleUpdateStatus.validForReview },
  { module: 'Computer Supported Collaborative Learning', status: ModuleUpdateStatus.invalid },
  { module: 'Projektarbeit - Forschung, Evaluation/Assessment, Verwertung im Kontext des Studienschwerpunkts', status: ModuleUpdateStatus.waitingForPublication },
  { module: 'Paradigmen der Programmierung', status: ModuleUpdateStatus.waitingForPublication },
  { module: 'Soziotechnische Systeme', status: ModuleUpdateStatus.waitingForApproval },
  { module: 'Coding Excellence', status: ModuleUpdateStatus.published },
  { module: 'Soziotechnische Entwurfsmuster', status: ModuleUpdateStatus.published },
]

@Component({
  selector: 'cops-my-modules-page',
  templateUrl: './my-modules-page.component.html',
  styleUrls: ['./my-modules-page.component.css'],
})

export class MyModulesPageComponent {
  
  displayedColumns: string[] = ['module',  'status', 'actions']
  dataSource: MatTableDataSource<Update> 
  selection = new SelectionModel<Update>(true, [])
  sort: MatSort = new MatSort()

  constructor() {
    this.dataSource = new MatTableDataSource<Update>(rawData)
  }
}
