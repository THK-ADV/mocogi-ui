import { DestroyRef, Injectable } from "@angular/core"
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"

@Injectable({
  providedIn: 'root'
})
export class ViewportServiceService {
  private isMobile = new BehaviorSubject<boolean>(false);
  isMobile$ : Observable<boolean> = this.isMobile.asObservable();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private destroyRef: DestroyRef
  ) {
    this.breakpointObserver.observe([Breakpoints.XSmall])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(state => {
        this.isMobile.next(state.matches);
        console.log(state.matches);
      })
  }
}
