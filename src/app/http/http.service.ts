import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable, zip } from 'rxjs'
import { Metadata } from '../types/metadata'
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

@Injectable({
  providedIn: 'root'
})
export class HttpService {


  constructor(private readonly http: HttpClient) {
  }

  allModules = (): Observable<Module[]> =>
    this.http.get<Module[]>('modules')

  allModulesForUser = (user: String): Observable<Module[]> =>
    this.http.get<Module[]>(`modules?user=${user}`)

  metadataById = (id: string): Observable<Metadata> =>
    this.http.get<Metadata>(`metadata/${id}`)

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

  allCoreData = () =>
    zip(
      this.allLocations(),
      this.allLanguages(),
      this.allStatus(),
      this.allAssessmentMethods(),
      this.allModuleTypes(),
      this.allSeasons(),
      this.allPersons(),
      this.allValidPOs(),
      this.allGrades(),
      this.allGlobalCriteria(),
      this.allStudyPrograms(),
      this.allCompetences(),
    )
}
