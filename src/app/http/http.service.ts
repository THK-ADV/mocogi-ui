import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { environment } from '../../environments/environment'

interface Metadata_ {
  metadata: Metadata
}

export interface Metadata {
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

  medataData = (): Observable<Metadata[]> =>
    this.http.get<Metadata_[]>(`${environment.backendUrl}/metadata`).pipe(
      map(xs => xs.map(x => x.metadata))
    )
}
