import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FolderGetterService {

  constructor(private http: HttpClient) { }
  serviceUrl = environment.url;
  baseEndPoint = environment.baseEndPoint;

  getDataSets() {
    return this.http.get<string[]>(this.serviceUrl + this.baseEndPoint + '/datasets');
  }


}
