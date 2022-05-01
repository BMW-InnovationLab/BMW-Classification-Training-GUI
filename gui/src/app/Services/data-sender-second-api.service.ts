import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {IConfig} from '../Interfaces/config';
import {Observable} from 'rxjs';
import {Dataset} from '../Interfaces/dataset';
import {Config} from 'codelyzer';
import {BasicConfig} from '../Interfaces/basicConfig';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataSenderSecondApiService {

  serviceUrl = environment.url;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  basicConfigPost(json: BasicConfig, apiPort: number): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + apiPort + '/config', json,{headers:this.headers});
  }

 advancedConfigPost(json: IConfig, apiPort: number): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + apiPort + '/config', json,{headers:this.headers});
  }

  datasetPost(json: Dataset, apiPort: number): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + apiPort + '/dataset', json,{headers:this.headers});
  }
}
