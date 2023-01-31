import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { Location } from '../types/core/location'
import { Language } from '../types/core/language'
import { Status } from '../types/core/status'
import { AssessmentMethod } from '../types/core/assessment-method'
import { ModuleType } from '../types/core/module-type'
import { Season } from '../types/core/season'
import { Faculty } from '../types/core/faculty'
import { Person } from '../types/core/person'
import { StudyFormType } from '../types/core/study-form-type'
import { PO } from '../types/core/po'
import { Grade } from '../types/core/grade'
import { FocusArea } from '../types/core/focus-area'
import { GlobalCriteria } from '../types/core/global-criteria'
import { StudyProgram } from '../types/core/study-program'
import { Competence } from '../types/core/competence'
import { Module } from '../types/module'
import { UserBranch } from '../types/user-branch'
import { ModuleDraft } from '../types/module-draft'
import { ModuleCompendium, ModuleCompendiumProtocol } from '../types/module-compendium'
import { ValidationResult } from '../types/validation-result'

@Injectable({
  providedIn: 'root'
})
export class HttpService {


  constructor(private readonly http: HttpClient) {
  }

  // Modules

  allModules = (): Observable<Module[]> =>
    this.http.get<Module[]>('modules')

  allModulesForUser = (user: String): Observable<Module[]> =>
    this.http.get<Module[]>(`modules?user=${user}`)

  // Module Compendium

  moduleCompendiumById = (id: string): Observable<ModuleCompendium> =>
    this.http.get<ModuleCompendium>(`moduleCompendium/${id}`)

  moduleCompendiumHtmlFile = (id: string) =>
    this.http.request('GET', `moduleCompendium/${id}/file`, {responseType: 'text'})

  // Core Data

  allLocations = (): Observable<Location[]> =>
    this.http.get<Location[]>('locations')

  allLanguages = (): Observable<Language[]> =>
    this.http.get<Language[]>('languages')

  allStatus = (): Observable<Status[]> =>
    this.http.get<Status[]>('status')

  allAssessmentMethods = (): Observable<AssessmentMethod[]> =>
    this.http.get<AssessmentMethod[]>('assessmentMethods')

  allModuleTypes = (): Observable<ModuleType[]> =>
    this.http.get<ModuleType[]>('moduleTypes')

  allSeasons = (): Observable<Season[]> =>
    this.http.get<Season[]>('seasons')

  allPersons = (): Observable<Person[]> =>
    this.http.get<Person[]>('persons')

  allStudyFormTypes = (): Observable<StudyFormType[]> =>
    this.http.get<StudyFormType[]>('studyFormTypes')

  allValidPOs = (): Observable<PO[]> =>
    this.http.get<PO[]>('pos?valid=true').pipe(
      map(pos => pos.map(po => ({
        ...po,
        date: new Date(po.date),
        dateFrom: new Date(po.dateFrom),
        dateTo: po.dateTo && new Date(po.dateTo),
        modificationDates: po.modificationDates.map(d => new Date(d))
      })))
    )

  allGrades = (): Observable<Grade[]> =>
    this.http.get<Grade[]>('grades')

  allFocusArea = (): Observable<FocusArea[]> =>
    this.http.get<FocusArea[]>('focusAreas')

  allFaculties = (): Observable<Faculty[]> =>
    this.http.get<Faculty[]>('faculties')

  allGlobalCriteria = (): Observable<GlobalCriteria[]> =>
    this.http.get<GlobalCriteria[]>('globalCriteria')

  allStudyPrograms = (): Observable<StudyProgram[]> =>
    this.http.get<StudyProgram[]>('studyPrograms').pipe(
      map(sps => sps.map(sp => ({
        ...sp,
        accreditationUntil: new Date(sp.accreditationUntil),
      })))
    )

  allCompetences = (): Observable<Competence[]> =>
    this.http.get<Competence[]>('competences')

  // Branch

  branchForUser = (username: string): Observable<UserBranch | undefined> =>
    this.http.get<UserBranch | undefined>(`git/branch/${username}`).pipe(
      map(b => b ? b : undefined)
    )

  createBranch = (username: string): Observable<UserBranch> =>
    this.http.post<UserBranch>(`git/branch`, {'username': username})

  // Module Draft

  moduleDrafts = (branch: string): Observable<ModuleDraft[]> =>
    this.http.get<ModuleDraft[]>(`moduleDrafts/${branch}`).pipe(
      map(xs => xs.map(this.convertModuleDraft))
    )

  addToDrafts = (
    branch: string,
    mc: ModuleCompendiumProtocol,
    id: string | undefined
  ): Observable<ModuleDraft> => {
    const body = {
      data: JSON.stringify(mc),
      branch: branch,
    }
    const request = id
      ? this.http.put<ModuleDraft>(`moduleDrafts/${id}`, body)
      : this.http.post<ModuleDraft>('moduleDrafts', body)

    return request.pipe(map(this.convertModuleDraft))
  }

  private convertModuleDraft = (draft: ModuleDraft): ModuleDraft =>
    // @ts-ignore
    ({...draft, lastModified: new Date(draft.lastModified), data: JSON.parse(draft.data)})

  // Validation

  validate = (branch: string): Observable<ValidationResult> =>
    this.http.get<ValidationResult>(`moduleDrafts/${branch}/validate`)
}
