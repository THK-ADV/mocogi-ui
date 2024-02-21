import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable, of } from 'rxjs'
import { Location } from '../types/core/location'
import { Language } from '../types/core/language'
import { Status } from '../types/core/status'
import { AssessmentMethod } from '../types/core/assessment-method'
import { ModuleType } from '../types/core/module-type'
import { Season } from '../types/core/season'
import { Identity } from '../types/core/person'
import { PO } from '../types/core/po'
import { Degree } from '../types/core/degree'
import { GlobalCriteria } from '../types/core/global-criteria'
// import { StudyProgram } from '../types/core/study-program'
import { Competence } from '../types/core/competence'
import { ModuleCore } from '../types/moduleCore'
import { UserBranch } from '../types/user-branch'
import { ModuleDraft, ModuleDraftSource } from '../types/module-draft'
import { Module, ModuleProtocol } from '../types/moduleCore'
import { ValidationResult } from '../types/validation-result'
import { Metadata } from '../types/metadata'
import { ModuleView } from '../types/module-view'
import { asRecord } from '../parser/record-parser'
import { Content } from '../types/content'

import { ModeratedModule, ModuleDraftState } from '../types/moderated.module'
import { Approval } from '../types/approval'
import { ModuleCatalog, Semester, StudyProgram, StudyProgramCore } from '../types/module-compendium'
import { ElectivesCatalogue } from '../types/electivesCatalogues'

export interface ModuleDraftJson {
  module: string
  user: string
  branch: string
  source: ModuleDraftSource
  data: string
  keysToBeReviewed: ReadonlyArray<string>
  modifiedKeys: ReadonlyArray<string>
  lastModified: string
}

export interface ModuleKey {
  abbrev: string,
  deLabel: string,
  deDesc: string,
  enLabel: string,
  enDesc: string,
}

export type ModuleDraftKeys = {
  modifiedKeys: Array<ModuleKey>
  keysToBeReviewed: Array<ModuleKey>
}

interface ModeratedModuleJson {
  module: ModuleCore
  moduleDraft: ModuleDraftJson | undefined
  moduleDraftState: ModuleDraftState
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  constructor(private readonly http: HttpClient) {
  }

  // Modules

  allModules = (): Observable<ModuleCore[]> =>
    this.http.get<ModuleCore[]>('modules')

  ownModules = (): Observable<ModuleCore[]> =>
    this.http.get<ModuleCore[]>('modules/own')

  // Module Compendium

  moduleDescriptionById = (id: string): Observable<Module> =>
    this.http.get<Module>(`modules/${id}`)

  latestModuleDescriptionById = (id: string): Observable<Module> =>
    this.http.get<Module>(`modules/${id}/latest`)

  stagingModuleDescriptionById = (id: string): Observable<Module> =>
    this.http.get<Module>(`modules/${id}/preview`)

  moduleDescriptionHtmlFile = (id: string) =>
    this.http.request('GET', `modules/${id}/file`, { responseType: 'text' })

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

  allIdentities = (): Observable<Identity[]> =>
    this.http.get<Identity[]>('identities')

  allValidPOs = (): Observable<PO[]> =>
    this.http.get<PO[]>('pos?valid=true').pipe(
      map(pos => pos.map(po => ({
        ...po,
        dateFrom: new Date(po.dateFrom),
        dateTo: po.dateTo && new Date(po.dateTo),
      }))),
    )

  allDegrees = (): Observable<Degree[]> =>
    this.http.get<Degree[]>('degrees')

  allGlobalCriteria = (): Observable<GlobalCriteria[]> =>
    this.http.get<GlobalCriteria[]>('globalCriteria')

  allStudyProgramCores = (): Observable<StudyProgramCore[]> =>
    this.http.get<StudyProgram[]>('studyPrograms?extend=false')

  allCompetences = (): Observable<Competence[]> =>
    this.http.get<Competence[]>('competences')

  // Draft

  createNewDraft = (
    mc: ModuleProtocol
  ): Observable<ModuleDraft> =>
    this.http
      .post<ModuleDraftJson>(
        'moduleDrafts',
        mc,
        {headers: {'Mocogi-Version-Scheme': 'v1.0s'}}
      )
      .pipe(map(this.convertModuleDraft))

  updateModuleDraft = (
    moduleId: string,
    moduleCompendiumProtocol: ModuleProtocol,
  ): Observable<unknown> =>
    this.http
      .put(
        `moduleDrafts/${moduleId}`,
        moduleCompendiumProtocol,
        {headers: {'Mocogi-Version-Scheme': 'v1.0s'}}
      )

  deleteDraft = (moduleId: string) =>
    this.http.delete(`moduleDrafts/${moduleId}`)

  // Branch

  createBranch = (username: string): Observable<UserBranch> =>
    this.http.post<UserBranch>('git/branch', {'username': username})

  // Module Draft

  moduleDrafts = (branch: string): Observable<ModuleDraft[]> =>
    this.http.get<ModuleDraftJson[]>(`moduleDrafts/${branch}`).pipe(
      map(xs => xs.map(this.convertModuleDraft)),
    )

  moduleDraftKeys = (moduleId: string): Observable<ModuleDraftKeys> =>
    this.http.get<ModuleDraftKeys>(`moduleDrafts/${moduleId}/keys`)

  moderatedModules = (): Observable<ModeratedModule[]> =>
    this.http.get<ModeratedModuleJson[]>('moduleDrafts/own').pipe(
      map(xs => xs.map(x => {
        return {
          ...x,
          moduleDraft: x.moduleDraft != null ? this.convertModuleDraft(x.moduleDraft) : undefined,
        }
      })),
    )

  addToDrafts = (
    branch: string,
    mc: ModuleProtocol,
    id: string | undefined,
  ): Observable<ModuleDraft> => {
    const body = {
      data: mc,
      branch: branch,
    }
    const request = id
      ? this.http.put<ModuleDraftJson>(`moduleDrafts/${id}`, body)
      : this.http.post<ModuleDraftJson>('moduleDrafts', body)

    return request.pipe(map(this.convertModuleDraft))
  }

  private convertModuleDraft = (draft: ModuleDraftJson): ModuleDraft => {
    const mc: ModuleProtocol = { // TODO improve
      deContent: asRecord(draft.data)['deContent'] as Content,
      enContent: asRecord(draft.data)['enContent'] as Content,
      metadata: asRecord(draft.data)['metadata'] as Metadata,
    }
    return ({...draft, lastModified: new Date(draft.lastModified), data: mc})
  }

  // Validation

  validate = (branch: string): Observable<ValidationResult> =>
    this.http.get<ValidationResult>(`moduleDrafts/${branch}/validate`)

  // Commit

  commit = (branch: string, username: string): Observable<unknown> =>
    this.http.put<unknown>(`moduleDrafts/${branch}/commit`, {username})

  revertCommit = (branch: string): Observable<unknown> =>
    this.http.delete<unknown>(`moduleDrafts/${branch}/revertCommit`)

  // View

  allStudyPrograms = (): Observable<ReadonlyArray<StudyProgram>> =>
    this.http.get<ReadonlyArray<StudyProgram>>('studyPrograms?extend=true')

  allModuleAtomic = (): Observable<ModuleView[]> =>
    this.http.get<ModuleView[]>('modules?extend=true')

  // Review

  requestReview = (moduleId: string): Observable<unknown> =>
    this.http.post(`moduleReviews/${moduleId}`, {})

  cancelReview = (moduleId: string): Observable<unknown> =>
    this.http.delete(`moduleReviews/${moduleId}`)

  // Approval

  ownApprovals = (): Observable<ReadonlyArray<Approval>> =>
    this.http.get<ReadonlyArray<Approval>>('moduleApprovals/own')

  getApprovals = (moduleId: string): Observable<ReadonlyArray<Approval>> =>
    this.http.get<ReadonlyArray<Approval>>(`moduleApprovals/${moduleId}`)

  getApproval = (moduleId: string, approvalId: string): Observable<unknown> =>
    this.http.get(`moduleApprovals/${moduleId}/${approvalId}`)

  submitApproval = (moduleId: string, approvalId: string, action: 'approve' | 'reject', comment?: string): Observable<unknown> =>
    this.http.put(`moduleApprovals/${moduleId}/${approvalId}`, {
      action,
      comment,
    })

  // Semester

  getSemesters = () => {
    const currentYear = (new Date()).getFullYear()
    const rangeInYears = 5
    const semesterTypes = [
      { id: 'wise', abbrev: 'WiSe', deLabel: 'Wintersemester', enLabel: 'Winter Semester' },
      { id: 'sose', abbrev: 'SoSe', deLabel: 'Sommersemester', enLabel: 'Summer Semester' },
    ]
    const semesterList: Array<Semester> = []
    for (let i = rangeInYears * -1; i < rangeInYears; i++) {
      semesterTypes.forEach((semesterType) => {
        semesterList.push({
          id: `${semesterType.id}_${currentYear + i}`,
          year: currentYear + i,
          abbrev: `${semesterType.abbrev} ${currentYear + i}`,
          deLabel: `${semesterType.deLabel} ${currentYear + i}`,
          enLabel: `${semesterType.enLabel} ${currentYear + i}`,
        })
      })
    }
    const semesters: ReadonlyArray<Semester> = semesterList
    return of(semesters)
  }

  // Module Compendium List

  allModuleCatalogs = (semester: string): Observable<ReadonlyArray<ModuleCatalog>> =>
    this.http.get<ReadonlyArray<ModuleCatalog>>(`moduleCatalogs/${semester}`)

  // Permissions

  getPermissions = (moduleId: string): Observable<Array<string>> =>
    this.http.get<Array<string>>(`moduleUpdatePermissions/${moduleId}`)

  setPermissions = (moduleId: string, permissions: ReadonlyArray<string>): Observable<unknown> =>
    this.http.post(`moduleUpdatePermissions/${moduleId}`, permissions)

  // Electives Catalogues

  allElectivesCatalogues = (semester: string): Observable<ReadonlyArray<ElectivesCatalogue>> =>
    this.http.get<ReadonlyArray<ElectivesCatalogue>>(`electivesCatalogs/${semester}`)
}