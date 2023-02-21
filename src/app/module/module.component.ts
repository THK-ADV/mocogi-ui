import { Component, OnDestroy, OnInit } from '@angular/core'
import { HttpService } from '../http/http.service'
import { Subscription } from 'rxjs'
import { Module } from '../types/module'
import { Router } from '@angular/router'

@Component({
  selector: 'sched-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit, OnDestroy {

  modules: Module[] = []
  sub?: Subscription

  constructor(private readonly service: HttpService, private readonly router: Router) {
  }

  ngOnInit(): void {
    this.sub = this.service.allModules()
      .subscribe(xs => this.modules = xs)
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  onSelectModule = (m: Module) =>
    this.router.navigate(['/show'], {state: {id: m.id}})
}
