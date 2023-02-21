import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Module } from '../../types/module'

@Component({
  selector: 'sched-module-list',
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent {
  @Input() modules!: Module[]
  @Output() selectModule = new EventEmitter<Module>()
}
