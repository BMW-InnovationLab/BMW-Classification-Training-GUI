import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataGetterFirstApiService {
  serviceUrl = environment.url;
  basePort = environment.baseEndPoint;

  constructor(private http: HttpClient) { }

  getDataSets() {
    return this.http.get<string[]>(this.serviceUrl + this.basePort + '/datasets');
  }

  getAvailableGPUs() {
    return this.http.get<number[]>(this.serviceUrl + this.basePort + '/gpu/info');
  }

  getUsedPorts() {
    return this.http.get<string[]>(this.serviceUrl + this.basePort + '/ports');
  }

  getAvailableNetworks() {
    return this.http.get<string[]>(this.serviceUrl + this.basePort + '/networks');
  }

  getAvailableCheckPoints() {
    return this.http.get<any>(this.serviceUrl + this.basePort + '/checkpoints');
  }

  getDownloadableModels() {
    return this.http.get<any>(this.serviceUrl + this.basePort + '/servable/models');

  }

  getAllJobs() {
    return this.http.get<string[]>(this.serviceUrl + this.basePort + '/jobs');
  }

  getFinishedJobs() {
    return this.http.get<string[]>(this.serviceUrl + this.basePort + '/jobs/finished');
  }
}
