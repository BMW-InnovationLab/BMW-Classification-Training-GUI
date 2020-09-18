import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Config} from 'codelyzer';
import {Observable} from 'rxjs';
import {AddJob} from '../Interfaces/addJob';
import {RemoveJob} from '../Interfaces/removeJob';

@Injectable({
  providedIn: 'root'
})
export class DataSenderFirstApiService {
  serviceUrl = environment.url;
  basePort = environment.baseEndPoint;

  constructor(private http: HttpClient) { }

  addJob(json: AddJob): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.basePort + '/jobs/add', JSON.stringify(json));
  }

  removeJob(json: RemoveJob): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.basePort + '/jobs/remove', JSON.stringify(json));
  }

  logs(json: RemoveJob) {
    return this.http.post<string[]>(this.serviceUrl + this.basePort + '/logs', JSON.stringify(json));
  }

}
