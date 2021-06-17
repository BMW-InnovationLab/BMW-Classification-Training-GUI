import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {IConfig} from '../domain/models/config';
import {Observable} from 'rxjs';
import {Dataset} from '../domain/models/dataset';
import {Config} from 'codelyzer';
import {BasicConfig} from '../domain/models/basic-config';

@Injectable({
  providedIn: 'root'
})
export class DataSenderSecondApiService {

  serviceUrl = environment.url;

  constructor(private http: HttpClient) { }

  basicConfigPost(json: BasicConfig, apiPort: number): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + apiPort + '/config', json);
  }

 advancedConfigPost(json: IConfig, apiPort: number): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + apiPort + '/config', json);
  }

  datasetPost(json: Dataset, apiPort: number): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + apiPort + '/dataset', json);
  }
}
