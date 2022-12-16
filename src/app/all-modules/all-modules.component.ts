import { Component, OnDestroy, OnInit } from '@angular/core'
import { HttpService, Metadata } from '../http/http.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'sched-all-modules',
  templateUrl: './all-modules.component.html',
  styleUrls: ['./all-modules.component.scss']
})
export class AllModulesComponent implements OnInit, OnDestroy {

  metadata: Metadata[] = []
  sub?: Subscription

  constructor(private readonly service: HttpService) {
  }

  ngOnInit(): void {
    this.sub = this.service.allMetadata()
      .subscribe(xs => this.metadata = xs)
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  urlFor = (m: Metadata): string => '/public/' + m.id + '.html'

}
