import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Config} from 'codelyzer';
import {Ijob} from '../Interfaces/ijob';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import { IPorts } from '../Interfaces/Ports';


@Injectable({
  providedIn: 'root'
})
export class JobsService {
  serviceUrl = environment.url;
  baseEndPoint = environment.baseEndPoint;

  jobs = new BehaviorSubject([]);
  downloadableModels = new BehaviorSubject([]);

  runningDatasetFolder = new BehaviorSubject<string>('');
  runningNetworkArchitecture = new BehaviorSubject<string>('');
  runningJobName = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
  }

  getDownloadableModels() {
    return this.http.get<string[]>(this.serviceUrl + this.baseEndPoint + '/servable/models');

  }

  getAllJobs() {
    // return this.allJobs;
    return this.http.get<string[]>(this.serviceUrl + this.baseEndPoint + '/jobs');
  }

  getFinishedJobs() {
    return this.http.get<string[]>(this.serviceUrl + this.baseEndPoint + '/jobs/finished');
  }

  stopJob(jobName: Ijob) {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.baseEndPoint + '/jobs/remove', JSON.stringify(jobName));
  }

  getJobLogs(jobName: Ijob) {
    return this.http.post<string[]>(this.serviceUrl + this.baseEndPoint + '/logs', JSON.stringify(jobName));
  }

  monitorJob(jobName: Ijob) {
    return this.http.post<any>(this.serviceUrl + this.baseEndPoint + '/monitor_job', JSON.stringify(jobName));
  }

  refreshMonitor(port: number) {
    return this.http.get<IPorts>(this.serviceUrl +  port + '/refresh_tensorboard');
  }

}
