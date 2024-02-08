import { Component, OnInit } from '@angular/core'
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { ElectivesCataloguesPageActions } from "../../state/actions/electives-catalogues.actions";
import { selectElectivesCatalogues } from "../../state/selectors/electives-catalogues.selector";
import { ElectivesCatalogue } from "../../types/electivesCatalogues";

@Component({
  selector: 'cops-elective-modules-lists-page',
  templateUrl: './elective-modules-lists-page.component.html',
  styleUrls: ['./elective-modules-lists-page.component.css'],
})
export class ElectiveModulesListsPageComponent implements OnInit{
  electivesCatalogues$: Observable<ReadonlyArray<ElectivesCatalogue>>

  constructor(private readonly store: Store) {
    this.electivesCatalogues$ = store.select(selectElectivesCatalogues)
  }

  ngOnInit(): void {
    this.store.dispatch(ElectivesCataloguesPageActions.enter())
  }
}
