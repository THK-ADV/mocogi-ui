import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
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
import { Module } from '../types/module'
import { UserBranch } from '../types/user-branch'
import { ModuleDraft, ModuleDraftStatus } from '../types/module-draft'
import { ModuleCompendium, ModuleCompendiumProtocol } from '../types/module-compendium'
import { ValidationResult } from '../types/validation-result'
import { Metadata } from '../types/metadata'
import { StudyProgramAtomic } from '../types/study-program-atomic'
import { ModuleAtomic } from '../types/module-atomic'
import { asRecord } from '../parser/record-parser'
import { Content } from '../types/content'

import { ModeratedModule, ModuleStatus } from '../types/moderated.module'
import { Approval } from '../components/approvals/approvals-list/approvals-list.component'

export interface ModuleDraftJson {
  module: string
  user: string
  branch: string
  status: ModuleDraftStatus
  data: string
  keysToBeReviewed: ReadonlyArray<string>
  modifiedKeys: ReadonlyArray<string>
  lastModified: string
}

export type ModuleDraftKeys = {
  modifiedKeys: Array<string>
  keysToBeReviewed: Array<string>
}

interface ModeratedModuleJson {
  module: Module
  moduleDraft: ModuleDraftJson | undefined
  status: ModuleStatus
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  constructor(private readonly http: HttpClient) {
  }

  // Modules

  allModules = (): Observable<Module[]> =>
    this.http.get<Module[]>('modules')

  ownModules = (): Observable<Module[]> =>
    this.http.get<Module[]>('modules/own')

  // Module Compendium

  moduleCompendiumById = (id: string): Observable<ModuleCompendium> =>
    this.http.get<ModuleCompendium>(`moduleCompendium/${ id }`)

  latestModuleCompendiumById = (id: string): Observable<ModuleCompendium> =>
    this.http.get<ModuleCompendium>(`moduleCompendium/${ id }/latest`)

  stagingModuleCompendiumById = (id: string): Observable<ModuleCompendium> =>
    this.http.get<ModuleCompendium>(`moduleCompendium/${ id }/staging`)

  moduleCompendiumHtmlFile = (id: string) =>
    this.http.request('GET', `moduleCompendium/${ id }/file`, {responseType: 'text'})

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

  allValidPOs = (): Observable<PO[]> =>
    this.http.get<PO[]>('pos?valid=true').pipe(
      map(pos => pos.map(po => ({
        ...po,
        date: new Date(po.date),
        dateFrom: new Date(po.dateFrom),
        dateTo: po.dateTo && new Date(po.dateTo),
        modificationDates: po.modificationDates.map(d => new Date(d)),
      }))),
    )

  allGrades = (): Observable<Grade[]> =>
    this.http.get<Grade[]>('grades')

  allGlobalCriteria = (): Observable<GlobalCriteria[]> =>
    this.http.get<GlobalCriteria[]>('globalCriteria')

  allStudyPrograms = (): Observable<StudyProgram[]> =>
    this.http.get<StudyProgram[]>('studyPrograms').pipe(
      map(sps => sps.map(sp => ({
        ...sp,
        accreditationUntil: new Date(sp.accreditationUntil),
      }))),
    )

  allCompetences = (): Observable<Competence[]> =>
    this.http.get<Competence[]>('competences')

  // Draft

  createNewDraft = (
    mc: ModuleCompendiumProtocol
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
    moduleCompendiumProtocol: ModuleCompendiumProtocol,
  ): Observable<unknown> =>
    this.http
      .put(
        `moduleDrafts/${ moduleId }`,
        moduleCompendiumProtocol,
        {headers: {'Mocogi-Version-Scheme': 'v1.0s'}}
      )

  deleteDraft = (moduleId: string) =>
    this.http.delete(`moduleDrafts/${ moduleId }`)

  // Branch

  createBranch = (username: string): Observable<UserBranch> =>
    this.http.post<UserBranch>('git/branch', {'username': username})

  // Module Draft

  moduleDrafts = (branch: string): Observable<ModuleDraft[]> =>
    this.http.get<ModuleDraftJson[]>(`moduleDrafts/${ branch }`).pipe(
      map(xs => xs.map(this.convertModuleDraft)),
    )

  moduleDraftKeys = (moduleId: string): Observable<ModuleDraftKeys> =>
    this.http.get<ModuleDraftKeys>(`moduleDrafts/${ moduleId }/keys`)

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
    mc: ModuleCompendiumProtocol,
    id: string | undefined,
  ): Observable<ModuleDraft> => {
    const body = {
      data: mc,
      branch: branch,
    }
    const request = id
      ? this.http.put<ModuleDraftJson>(`moduleDrafts/${ id }`, body)
      : this.http.post<ModuleDraftJson>('moduleDrafts', body)

    return request.pipe(map(this.convertModuleDraft))
  }

  private convertModuleDraft = (draft: ModuleDraftJson): ModuleDraft => {
    const mc: ModuleCompendiumProtocol = { // TODO improve
      deContent: asRecord(draft.data)['deContent'] as Content,
      enContent: asRecord(draft.data)['enContent'] as Content,
      metadata: asRecord(draft.data)['metadata'] as Metadata,
    }
    return ({...draft, lastModified: new Date(draft.lastModified), data: mc})
  }

  // Validation

  validate = (branch: string): Observable<ValidationResult> =>
    this.http.get<ValidationResult>(`moduleDrafts/${ branch }/validate`)

  // Commit

  commit = (branch: string, username: string): Observable<unknown> =>
    this.http.put<unknown>(`moduleDrafts/${ branch }/commit`, {username})

  revertCommit = (branch: string): Observable<unknown> =>
    this.http.delete<unknown>(`moduleDrafts/${ branch }/revertCommit`)

  // View

  allStudyProgramAtomic = (): Observable<StudyProgramAtomic[]> =>
    this.http.get<StudyProgramAtomic[]>('studyPrograms/view')

  allModuleAtomic = (): Observable<ModuleAtomic[]> =>
    this.http.get<ModuleAtomic[]>('modules/view')

  // Review

  requestReview = (moduleId: string): Observable<unknown> =>
    this.http.post(`moduleReviews/${ moduleId }`, {})

  cancelReview = (moduleId: string): Observable<unknown> =>
    this.http.delete(`moduleReviews/${ moduleId }`)

  // Approval

  ownApprovals = () : Observable<ReadonlyArray<Approval>> =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.http.get('moduleApprovals/own?user=cnoss')

  getApproval = (approvalId: string): Observable<unknown> =>
    this.http.get(`moduleApprovals/${ approvalId }`)

  submitApproval = (approvalId: string, action: 'approve' | 'reject', comment?: string): Observable<unknown> =>
    this.http.put(`moduleApprovals/${ approvalId }`, {
      action,
      comment,
    })
}