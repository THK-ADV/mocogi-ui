import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable, zip } from 'rxjs'

export interface Workload {
  lecture: number,
  seminar: number,
  practical: number,
  exercise: number,
  projectSupervision: number,
  projectWork: number,
  selfStudy: number,
  total: number
}

export interface Participants {
  min: number
  max: number
}

export interface ModulePreview {
  id: string
  abbrev: string
}

export interface Parent {
  kind: 'parent'
  children: ModulePreview[]
}

export interface Child {
  kind: 'child'
  parent: ModulePreview
}

export type ModuleRelation = Parent | Child

export interface AssessmentMethodEntry {
  method: string,
  percentage?: number,
  precondition: string[]
}

export interface AssessmentMethods {
  mandatory: AssessmentMethodEntry[],
  optional: AssessmentMethodEntry[]
}

export interface PrerequisiteEntry {
  text: string,
  modules: string[],
  pos: string[]
}

export interface PrerequisitesOutput {
  recommended?: PrerequisiteEntry,
  required?: PrerequisiteEntry
}

export interface POMandatory {
  po: string,
  recommendedSemester: number[],
  recommendedSemesterPartTime: number[]
}

export interface POOptional {
  po: string,
  instanceOf: string,
  partOfCatalog: boolean,
  recommendedSemester: number[]
}

export interface POs {
  mandatory: POMandatory[],
  optional: POOptional[]
}

export interface Metadata {
  id: string,
  title: string,
  abbrev: string,
  moduleType: string,
  ects: number,
  language: string,
  duration: number,
  season: string,
  workload: Workload,
  status: string,
  location: string,
  participants?: Participants,
  moduleRelation?: ModuleRelation,
  moduleManagement: string[],
  lecturers: string[],
  assessmentMethods: AssessmentMethods,
  prerequisites: PrerequisitesOutput,
  po: POs,
  competences: string[],
  globalCriteria: string[],
  taughtWith: string[]
}

export interface MetadataPreview {
  id: string
  title: string
  abbrev: string
}

export interface Location {
  abbrev: string
  deLabel: string
  enLabel: string
}

export interface Language {
  abbrev: string
  deLabel: string
  enLabel: string
}

export interface Status {
  abbrev: string
  deLabel: string
  enLabel: string
}

export interface AssessmentMethod {
  abbrev: string
  deLabel: string
  enLabel: string
}

export interface ModuleType {
  abbrev: string
  deLabel: string
  enLabel: string
}

export interface Season {
  abbrev: string
  deLabel: string
  enLabel: string
}

export interface Faculty {
  abbrev: string
  deLabel: string
  enLabel: string
}

export interface PersonStatus {
  deLabel: string
  enLabel: string
}

export interface SinglePerson {
  id: string
  lastname: string
  firstname: string
  title: string
  faculties: Faculty[]
  abbreviation: string
  status: PersonStatus
  kind: 'single'
}

export interface UnknownPerson {
  id: string
  title: string
  kind: 'unknown'
}

export interface GroupPerson {
  id: string
  title: string
  kind: 'group'
}

export type Person = SinglePerson | UnknownPerson | GroupPerson

export interface StudyFormType {
  abbrev: string
  deLabel: string
  enLabel: string
}

export interface PO {
  abbrev: string,
  version: number,
  date: Date,
  dateFrom: Date,
  dateTo?: Date,
  modificationDates: Date[],
  program: string
}

export interface POPreview {
  id: string
  label: string
  abbrev: string
}

export interface Grade {
  abbrev: string
  deLabel: string
  enLabel: string
  deDesc: string
  enDesc: string
}

export interface FocusArea {
  abbrev: string
  program: string
  deLabel: string
  enLabel: string
  deDesc: string
  enDesc: string
}

export interface GlobalCriteria {
  abbrev: string
  deLabel: string
  enLabel: string
  deDesc: string
  enDesc: string
}

export interface RestrictedAdmission {
  value: boolean
  deReason: string
  enReason: string
}

export interface StudyProgram {
  abbrev: string,
  deLabel: string,
  enLabel: string,
  internalAbbreviation: string,
  externalAbbreviation: string,
  deUrl: string,
  enUrl: string,
  grade: string,
  programDirector: string,
  accreditationUntil: Date,
  restrictedAdmission: RestrictedAdmission,
  studyForm: string[],
  language: string[],
  seasons: string[],
  campus: string[],
  deDescription: string,
  deNote: string,
  enDescription: string,
  enNote: string
}

export interface Competence {
  abbrev: string
  deLabel: string
  enLabel: string
  deDesc: string
  enDesc: string
}

export interface Module {
  id: string
  title: string
  abbrev: string
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {


  constructor(private readonly http: HttpClient) {
  }

  allModules = (): Observable<Module[]> =>
    this.http.get<Module[]>('metadata?preview=true')

  allModulesForUser = (user: String): Observable<Module[]> =>
    this.http.get<Module[]>(`metadata?user=${user}&preview=true`)

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
