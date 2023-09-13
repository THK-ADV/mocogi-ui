import { Component } from '@angular/core'
import { SelectionModel } from '@angular/cdk/collections'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'

type Module = {
  id: string,
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

const rawData: Module[] = [
  { id: '10dd7848-4710-11ee-be56-0242ac120002', module: 'Beautiful Code', status: ModuleUpdateStatus.waitingForApproval },
  { id: '10dd7bd6-4710-11ee-be56-0242ac120002', module: 'Projektanteil Projekt 1', status: ModuleUpdateStatus.validForPublication },
  { id: '10dd7fb4-4710-11ee-be56-0242ac120002', module: 'Projektanteil Projekt 2', status: ModuleUpdateStatus.validForReview },
  { id: '10dd80e0-4710-11ee-be56-0242ac120002', module: 'Computer Supported Collaborative Learning', status: ModuleUpdateStatus.invalid },
  { id: '10dd81da-4710-11ee-be56-0242ac120002', module: 'Projektarbeit - Forschung, Evaluation/Assessment, Verwertung im Kontext des Studienschwerpunkts', status: ModuleUpdateStatus.waitingForPublication },
  { id: '10dd82de-4710-11ee-be56-0242ac120002', module: 'Paradigmen der Programmierung', status: ModuleUpdateStatus.waitingForPublication },
  { id: '10dd8446-4710-11ee-be56-0242ac120002', module: 'Soziotechnische Systeme', status: ModuleUpdateStatus.waitingForApproval },
  { id: '10dd8540-4710-11ee-be56-0242ac120002', module: 'Coding Excellence', status: ModuleUpdateStatus.published },
  { id: '10dd8630-4710-11ee-be56-0242ac120002', module: 'Soziotechnische Entwurfsmuster', status: ModuleUpdateStatus.published },
]

@Component({
  selector: 'cops-my-modules-page',
  templateUrl: './my-modules-page.component.html',
  styleUrls: ['./my-modules-page.component.css'],
})

export class MyModulesPageComponent {
  
  displayedColumns: string[] = ['module',  'status', 'actions']
  dataSource: MatTableDataSource<Module> 
  selection = new SelectionModel<Module>(true, [])
  sort: MatSort = new MatSort()

  constructor() {
    this.dataSource = new MatTableDataSource<Module>(rawData)
  }
}
