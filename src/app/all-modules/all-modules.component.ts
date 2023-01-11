import { Component, OnDestroy, OnInit } from '@angular/core'
import { HttpService } from '../http/http.service'
import { Subscription } from 'rxjs'
import { Module } from '../types/module'

@Component({
  selector: 'sched-all-modules',
  templateUrl: './all-modules.component.html',
  styleUrls: ['./all-modules.component.scss']
})
export class AllModulesComponent implements OnInit, OnDestroy {

  modules: Module[] = []
  sub?: Subscription

  constructor(private readonly service: HttpService) {
  }

  ngOnInit(): void {
    this.sub = this.service.allModules()
      .subscribe(xs => this.modules = xs)
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  urlFor = (m: Module): string => '/public/' + m.id + '.html'

}
