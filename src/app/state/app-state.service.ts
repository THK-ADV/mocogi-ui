import { Injectable, OnDestroy } from '@angular/core'
import { HttpService } from '../http/http.service'
import { Observable, Subject, Subscription } from 'rxjs'
import { Module } from '../types/module'
import { UserBranch } from '../types/user-branch'
import { either, Either } from '../types/either'
import { ModuleDraft } from '../types/module-draft'

@Injectable({
  providedIn: 'root'
})
export class AppStateService implements OnDestroy {
  private subs: Subscription[] = []

  private usersModules: ReadonlyArray<Module> = []
  private usersModulesSubject = new Subject<ReadonlyArray<Module>>()

  private userBranch?: Either<undefined, UserBranch>
  private userBranchSubject = new Subject<Either<undefined, UserBranch>>()

  private moduleDrafts: ReadonlyArray<ModuleDraft> = []
  private moduleDraftsSubject = new Subject<ReadonlyArray<ModuleDraft>>()

  private editMode: boolean = false
  private editModeSubject = new Subject<boolean>()

  constructor(private readonly http: HttpService) {
    console.log('AppStateService constructor')
  }

  ngOnDestroy(): void {
    console.log('AppStateService destroy')
    this.subs.forEach(s => s.unsubscribe())
  }

  // Users Modules

  getModulesForUser = (user: string) => {
    if (this.usersModules.length !== 0) {
      this.usersModulesSubject.next(this.usersModules)
    } else {
      this.subs.push(
        this.http.allModulesForUser(user)
          .subscribe(xs => {
            this.usersModules = xs
            this.usersModulesSubject.next(xs)
          })
      )
    }
  }

  usersModules$ = (): Observable<ReadonlyArray<Module>> =>
    this.usersModulesSubject.asObservable()

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
    if (this.moduleDrafts.length !== 0) {
      this.moduleDraftsSubject.next(this.moduleDrafts)
    } else {
      this.subs.push(
        this.http.moduleDrafts(branch)
          .subscribe(xs => {
            this.moduleDrafts = xs
            this.moduleDraftsSubject.next(xs)
          })
      )
    }
  }

  moduleDrafts$ = (): Observable<ReadonlyArray<ModuleDraft>> =>
    this.moduleDraftsSubject.asObservable()

  // Edit mode

  getEditMode = () => {
    this.editModeSubject.next(this.editMode)
  }

  setEditMode = (value: boolean) => {
    this.editMode = value
    this.editModeSubject.next(value)
  }

  editMode$ = (): Observable<boolean> =>
    this.editModeSubject.asObservable()
}
