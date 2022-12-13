import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable, of } from 'rxjs'
import { environment } from '../../environments/environment'

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
    this.http.get<Metadata[]>(`${environment.backendUrl}/metadata`)

  medataDataForUser = (user: String): Observable<Metadata[]> =>
    of([
      {title: 'Algorithmen und Programmierung 2', id: '1', abbrev: 'ap2'},
      {title: 'Paradigmen der Programmierung 2', id: '2', abbrev: 'pp'},
    ])
  //this.http.get<Metadata[]>(`${environment.backendUrl}/metadata?user=${user}`)
}
