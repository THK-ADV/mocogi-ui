import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

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

  allMetadata = (): Observable<Metadata[]> =>
    this.http.get<Metadata[]>('metadata')

  allMetadataForUser = (user: String): Observable<Metadata[]> =>
    this.http.get<Metadata[]>(`metadata?user=${user}`)
}
