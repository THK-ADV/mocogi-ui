import { Injectable, OnDestroy } from '@angular/core'
import { HttpService } from '../http/http.service'
import { Observable, Subject, Subscription } from 'rxjs'
import { Module } from '../types/module'
import { UserBranch } from '../types/user-branch'
import { either, Either } from '../types/either'
import { ModuleDraft } from '../types/module-draft'

interface State<A> {
  value: A
  subject: Subject<A>
}

function createState<A>(initialState: A): State<A> {
  return {value: initialState, subject: new Subject<A>()}
}

function asObservable<A>(state: State<A>): Observable<A> {
  return state.subject.asObservable()
}

function emitCurrentValue<A>(state: State<A>) {
  state.subject.next(state.value)
}

function updateArrayState<A>(state: State<A>, updateState: () => Observable<A>): Subscription | undefined {
  if (Array.isArray(state.value)) {
    if (state.value.length !== 0) {
      emitCurrentValue(state)
      return undefined
    } else {
      return updateState().subscribe(a => {
        state.value = a
        emitCurrentValue(state)
      })
    }
  } else {
    throw new Error('unable to handle type of ' + state)
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService implements OnDestroy {
  private subs: Subscription[] = []

  private usersModules = createState<ReadonlyArray<Module>>([])
  private moduleDrafts = createState<ReadonlyArray<ModuleDraft>>([])
  private editMode = createState(false)

  private userBranch?: Either<undefined, UserBranch>
  private userBranchSubject = new Subject<Either<undefined, UserBranch>>()

  constructor(private readonly http: HttpService) {
    console.log('AppStateService constructor')
  }

  ngOnDestroy(): void {
    console.log('AppStateService destroy')
    this.subs.forEach(s => s.unsubscribe())
  }

  private subscribe = (s: Subscription | undefined) =>
    s && this.subs.push(s)

  // Users Modules

  getModulesForUser = (user: string) => {
    this.subscribe(
      updateArrayState(this.usersModules, () => this.http.allModulesForUser(user))
    )
  }

  usersModules$ = (): Observable<ReadonlyArray<Module>> =>
    asObservable(this.usersModules)

  // Users Branch

  getBranchForUser = (username: string) => {
    if (this.userBranch) {
      this.userBranchSubject.next(this.userBranch)
    } else {
      this.subs.push(
        this.http.branchForUser(username)
          .subscribe(this.updateUsersBranch)
      )
    }
  }

  private updateUsersBranch = (branch: UserBranch | undefined): Either<undefined, UserBranch> => {
    const userBranch = either(
      branch !== undefined,
      () => branch!,
      () => undefined
    )
    this.userBranch = userBranch
    this.userBranchSubject.next(userBranch)
    return userBranch
  }

  createBranchForUser = (username: string, completion?: (branch: Either<undefined, UserBranch>) => void) => {
    this.subs.push(
      this.http.createBranch(username)
        .subscribe(branch => {
          const res = this.updateUsersBranch(branch)
          completion?.(res)
        })
    )
  }

  userBranch$ = (): Observable<Either<undefined, UserBranch>> =>
    this.userBranchSubject.asObservable()

  // Module Drafts

  getModuleDrafts = (branch: string) => {
    this.subscribe(
      updateArrayState(this.moduleDrafts, () => this.http.moduleDrafts(branch))
    )
  }

  moduleDrafts$ = (): Observable<ReadonlyArray<ModuleDraft>> =>
    asObservable(this.moduleDrafts)

  // Edit mode

  getEditMode = () => {
    emitCurrentValue(this.editMode)
  }

  setEditMode = (value: boolean) => {
    this.editMode.value = value
    emitCurrentValue(this.editMode)
  }

  editMode$ = (): Observable<boolean> =>
    asObservable(this.editMode)
}
