import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfigFileManagerService {

  constructor(private http: HttpClient) {
  }

  serviceUrl = environment.url;


  resetEnteringCreateJobComponent = new BehaviorSubject<number>(0);

  numClasses = new BehaviorSubject(0);
  batchSize = new BehaviorSubject(0);
  learningRate = new BehaviorSubject(0);
  trainingSteps = new BehaviorSubject(0);
  evalSteps = new BehaviorSubject(0);
  width = new BehaviorSubject(0);
  height = new BehaviorSubject(0);



  // resetEnteringCreateJobComponentAvancedHyperParameters = new BehaviorSubject<number>(0);

  // advancedTrainingSteps = new BehaviorSubject(0);
  // advancedEvaluationSteps = new BehaviorSubject(0);



  getConfigFile(apiPort: number, networkArchitecture: string) {
    const jsn = {
      network_architecture : networkArchitecture
    };
    return this.http.post(this.serviceUrl + apiPort + '/get_config_content', jsn);
  }

  // resetSubjects() {
  //   this.numClasses.next(0);
  //   this.batchSize.next(0);
  //   this.learningRate.next(0);
  //   this.width.next(0);
  //   this.height.next(0);
  //   this.trainingSteps.next(0);
  //   this.evalSteps.next(0);
  // }
}

