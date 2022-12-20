import { Component, OnDestroy, OnInit } from '@angular/core'
import { HttpService, MetadataPreview } from '../http/http.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'sched-all-modules',
  templateUrl: './all-modules.component.html',
  styleUrls: ['./all-modules.component.scss']
})
export class AllModulesComponent implements OnInit, OnDestroy {

  metadata: MetadataPreview[] = []
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

  urlFor = (m: MetadataPreview): string => '/public/' + m.id + '.html'

}
