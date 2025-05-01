import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectModules } from '../../state/selectors/module.selectors'
import { ModulePageActions } from '../../state/actions/module.actions'
import { ModuleTableEntry } from './module-list/module-table-entry'
import { ViewportServiceService} from "../../viewport-service.service"

@Component({
  selector: 'cops-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
  standalone: false,
})
export class ModuleComponent implements OnInit {
  modules$: Observable<ModuleTableEntry[]>
  isMobile$ = this.viewportService.isMobile$;

  constructor(private readonly store: Store, private viewportService: ViewportServiceService) {
    this.modules$ = store.select(selectModules)
  }

  ngOnInit(): void {
    this.store.dispatch(ModulePageActions.enter())
  }
}
