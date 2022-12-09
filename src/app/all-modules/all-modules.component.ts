import { Component, OnDestroy, OnInit } from '@angular/core'
import { HttpService, Metadata } from '../http/http.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-all-modules',
  templateUrl: './all-modules.component.html',
  styleUrls: ['./all-modules.component.css']
})
export class AllModulesComponent implements OnInit, OnDestroy {

  metadata: Metadata[] = []
  sub?: Subscription

  constructor(private readonly service: HttpService) {
  }

  ngOnInit(): void {
    this.sub = this.service.medataData()
      .subscribe(xs => this.metadata = xs)
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

  urlFor = (m: Metadata): string => '/public/' + m.id + '.html'

}
