import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Module } from '../../types/module'

@Component({
  selector: 'sched-module-list-entry',
  templateUrl: './module-list-entry.component.html',
  styleUrls: ['./module-list-entry.component.css']
})
export class ModuleListEntryComponent {
  @Input() module!: Module
  @Output() selectModule = new EventEmitter<Module>()
}
