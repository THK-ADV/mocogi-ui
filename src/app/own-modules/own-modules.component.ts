import { Component, OnDestroy, OnInit } from '@angular/core'
import { HttpService, Metadata } from '../http/http.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-own-modules',
  templateUrl: './own-modules.component.html',
  styleUrls: ['./own-modules.component.css']
})
export class OwnModulesComponent implements OnInit, OnDestroy {

  metadata: Metadata[] = []
  sub?: Subscription

  constructor(private readonly http: HttpService) {
  }

  ngOnInit(): void {
    this.sub = this.http.medataDataForUser('cko')
      .subscribe(xs => this.metadata = xs)
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }
}
