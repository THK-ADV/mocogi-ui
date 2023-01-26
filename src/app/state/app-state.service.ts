import { Injectable, OnDestroy } from '@angular/core'
import { HttpService } from '../http/http.service'
import { map, Observable, Subject, Subscription, tap, zip } from 'rxjs'
import { Module } from '../types/module'
import { UserBranch } from '../types/user-branch'
import { either, Either } from '../types/either'
import { ModuleDraft } from '../types/module-draft'
import { Location } from '../types/core/location'
import { Language } from '../types/core/language'
import { Status } from '../types/core/status'
import { AssessmentMethod } from '../types/core/assessment-method'
import { ModuleType } from '../types/core/module-type'
import { Season } from '../types/core/season'
import { Person } from '../types/core/person'
import { PO } from '../types/core/po'
import { Grade } from '../types/core/grade'
import { GlobalCriteria } from '../types/core/global-criteria'
import { StudyProgram } from '../types/core/study-program'
import { Competence } from '../types/core/competence'
import { ModuleCompendiumProtocol } from '../types/module-compendium'
import { PipelineError } from '../types/pipeline-error'

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
  private allModules = createState<ReadonlyArray<Module>>([])
  private locations = createState<ReadonlyArray<Location>>([])
  private languages = createState<ReadonlyArray<Language>>([])
  private status = createState<ReadonlyArray<Status>>([])
  private assessmentMethods = createState<ReadonlyArray<AssessmentMethod>>([])
  private moduleTypes = createState<ReadonlyArray<ModuleType>>([])
  private seasons = createState<ReadonlyArray<Season>>([])
  private persons = createState<ReadonlyArray<Person>>([])
  private pos = createState<ReadonlyArray<PO>>([])
  private grades = createState<ReadonlyArray<Grade>>([])
  private globalCriteria = createState<ReadonlyArray<GlobalCriteria>>([])
  private studyPrograms = createState<ReadonlyArray<StudyProgram>>([])
  private competences = createState<ReadonlyArray<Competence>>([])

  private userBranch?: Either<undefined, UserBranch>
  private userBranchSubject = new Subject<Either<undefined, UserBranch>>()

  private pipelineErrors = createState<ReadonlyArray<PipelineError>>([])

  constructor(private readonly http: HttpService) {
    console.log('AppStateService constructor')
  }

  ngOnDestroy(): void {
    console.log('AppStateService destroy')
    this.subs.forEach(s => s.unsubscribe())
  }

  private addSubscription = (s?: Subscription | Array<Subscription | undefined>) =>
    s && (Array.isArray(s) ? s.forEach(this.addSubscription) : this.subs.push(s))

  // Users Modules

  getModulesForUser = (user: string) => {
    this.addSubscription(
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

  // Module Drafts

  getModuleDrafts = (branch: string) => {
    this.addSubscription(
      updateArrayState(this.moduleDrafts, () => this.http.moduleDrafts(branch))
    )
  }

  addModuleDraft = (mc: ModuleCompendiumProtocol, id: string | undefined) => {
    const branch = this.userBranch?.value?.branch
    if (!branch) {
      return
    }

    this.addSubscription(
      this.http.addToDrafts(branch, mc, id)
        .subscribe(draft => {
          console.log(draft)
          const index = this.moduleDrafts.value.findIndex(d => d.module === draft.module)
          if (index === -1) {
            this.moduleDrafts.value = [...this.moduleDrafts.value, draft]
          } else {
            this.moduleDrafts.value = this.moduleDrafts.value.map(d => d.module === draft.module ? draft : d)
          }
          emitCurrentValue(this.moduleDrafts)
        })
    )
  }

  moduleDrafts$ = (): Observable<ReadonlyArray<ModuleDraft>> =>
    asObservable(this.moduleDrafts).pipe(tap(xs => console.log('MODULE_DRAFTS', xs)))

  // Users Modules + Drafts

  usersDraftingModules$ = (): Observable<ReadonlyArray<[Module, ModuleDraft | undefined]>> =>
    zip(this.usersModules$(), this.moduleDrafts$()).pipe(
      map(([usersModules, drafts]) => {
        const res: Array<[Module, ModuleDraft | undefined]> = []
        usersModules.forEach(m => res.push([m, drafts.find(d => d.module === m.id)]))
        drafts.forEach(draft => {
          if (draft.status === 'added') {
            const module: Module = {
              id: draft.module,
              title: draft.data.metadata.title,
              abbrev: draft.data.metadata.abbrev
            }
            res.push([module, draft])
          }
        })
        return res
      })
    )

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

  // All Modules

  getAllModules = () => {
    this.addSubscription(
      updateArrayState(this.allModules, () => this.http.allModules())
    )
  }

  allModules$ = (): Observable<ReadonlyArray<Module>> =>
    asObservable(this.allModules)

  // All Core Data

  getCoreData = () => {
    this.addSubscription([
      updateArrayState(this.locations, () => this.http.allLocations()),
      updateArrayState(this.languages, () => this.http.allLanguages()),
      updateArrayState(this.status, () => this.http.allStatus()),
      updateArrayState(this.assessmentMethods, () => this.http.allAssessmentMethods()),
      updateArrayState(this.moduleTypes, () => this.http.allModuleTypes()),
      updateArrayState(this.seasons, () => this.http.allSeasons()),
      updateArrayState(this.persons, () => this.http.allPersons()),
      updateArrayState(this.pos, () => this.http.allValidPOs()),
      updateArrayState(this.grades, () => this.http.allGrades()),
      updateArrayState(this.globalCriteria, () => this.http.allGlobalCriteria()),
      updateArrayState(this.studyPrograms, () => this.http.allStudyPrograms()),
      updateArrayState(this.competences, () => this.http.allCompetences()),
    ])
  }

  coreData$ = (): Observable<[
    ReadonlyArray<Location>,
    ReadonlyArray<Language>,
    ReadonlyArray<Status>,
    ReadonlyArray<AssessmentMethod>,
    ReadonlyArray<ModuleType>,
    ReadonlyArray<Season>,
    ReadonlyArray<Person>,
    ReadonlyArray<PO>,
    ReadonlyArray<Grade>,
    ReadonlyArray<GlobalCriteria>,
    ReadonlyArray<StudyProgram>,
    ReadonlyArray<Competence>
  ]> =>
    zip(
      this.locations.subject.asObservable(),
      this.languages.subject.asObservable(),
      this.status.subject.asObservable(),
      this.assessmentMethods.subject.asObservable(),
      this.moduleTypes.subject.asObservable(),
      this.seasons.subject.asObservable(),
      this.persons.subject.asObservable(),
      this.pos.subject.asObservable(),
      this.grades.subject.asObservable(),
      this.globalCriteria.subject.asObservable(),
      this.studyPrograms.subject.asObservable(),
      this.competences.subject.asObservable()
    )

  // Validation

  getPipelineErrors = () => {
    const branch = this.userBranch?.value?.branch
    if (branch) {
      this.addSubscription(
        updateArrayState(this.pipelineErrors, () => this.http.validate(branch))
      )
    }
  }

  pipelineErrors$ = (): Observable<ReadonlyArray<PipelineError>> =>
    asObservable(this.pipelineErrors)
}