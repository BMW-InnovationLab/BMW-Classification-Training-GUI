import {Injectable} from '@angular/core';
import {IPrepareDataSet} from '../Interfaces/prepare-data-set';
import {IgeneralSettings} from '../Interfaces/Igeneral-settings';
import {Observable} from 'rxjs';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {IHyperParameters} from '../Interfaces/IHyperParameters';
import {ITfRecord} from '../Interfaces/i-tf-record';
import {IConfig} from '../Interfaces/IConfig';
import {Config} from 'codelyzer';
import {DataSetInfo} from '../Interfaces/data-set-info';
import {IStartJob} from '../Interfaces/istart-job';
import {environment} from '../../environments/environment';
import {AdvancedHyperParameters} from '../Interfaces/advanced-hyper-parameters';

@Injectable({
  providedIn: 'root'
})
export class DataValidatorService {
  // dataSetData : PrepareDataSet = [];
  serviceUrl = environment.url;
  baseEndPoint = environment.baseEndPoint;

  constructor(private http: HttpClient) {
  }

  config: IConfig;
  prepareDataSet: IPrepareDataSet;
  generalSettings: IgeneralSettings;
  hyperParameters: IHyperParameters;
  APIPort: number;
  sendImageControl: boolean;
  checkPointsAvailable = false;

  setCheckPointAvailable(resp: boolean) {
    this.checkPointsAvailable = resp;
  }


  sendDatasetInfo(dataSetData: IPrepareDataSet): Observable<HttpResponse<Config>> {
    this.prepareDataSet = Object.assign({}, dataSetData);
    // console.log(dataSetData);
    // console.log('ín the service the first object is ' , this.prepareDataSet);
    // console.log(dataSetData.datasetFolder);
    const jsn = {
      dataset_path: dataSetData.dataset_name,
      // labels_type: dataSetData.typeOfLabel
    };
    // console.log('the second object the sent is ', jsn);
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.baseEndPoint + '/datasets', JSON.stringify(jsn));
  }


  getLabelsType(name: string): Observable<any> {
    const jsn = {
      dataset_name: name
    };
    console.log(JSON.stringify(jsn));
    return this.http.post<any>(this.serviceUrl + this.baseEndPoint + '/get_labels_type' , JSON.stringify(jsn));
  }


  create_pbtxt() {
    return this.http.get(this.serviceUrl + this.APIPort + '/create_pbtxt');
  }

  // create_tfrecord() {
  //   const tfrecordData: ITfRecord = {
  //     labels_type: this.prepareDataSet.typeOfLabel,
  //     split_percentage: this.prepareDataSet.splitPercentage
  //   };
  //   return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.APIPort + '/create_tfrecord', JSON.stringify(tfrecordData));
  // }

  startJob(dataSetData: IgeneralSettings): Observable<HttpResponse<Config>> {
    this.generalSettings = Object.assign({}, dataSetData);
    const jsn = {
      name: this.generalSettings.containerName,
      // network_architecture: this.generalSettings.networkArchitecture,
      // dataset_path: this.prepareDataSet.datasetFolder,
      // // @ts-ignore
      // gpus: this.generalSettings.gPUs,
      // tensorboard_port: this.generalSettings.tensorBoard,
      api_port: this.generalSettings.APIPort
    };
    this.APIPort = jsn.api_port;
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.baseEndPoint + '/jobs/add', JSON.stringify(jsn));
  }

  configPost(json: IConfig): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.APIPort + '/config', json);
  }

  datasetPost(json: IPrepareDataSet): Observable<HttpResponse<Config>> {
    return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.APIPort + '/dataset', json);
  }

  // hyperParametersValidator(dataSetData: IHyperParameters): Observable<HttpResponse<Config>> {
  //
  //   this.hyperParameters = Object.assign({}, dataSetData);
  //   if (this.sendImageControl) {
  //     this.config = {
  //       // num_classes: this.hyperParameters.num_classes,
  //       lr: this.hyperParameters.lr,
  //       batch_size: this.hyperParameters.batch_size,
  //       epochs: this.hyperParameters.epochs,
  //       // eval_steps: this.hyperParameters.eval_steps,
  //       // network_architecture: this.generalSettings.networkArchitecture,
  //       // training_steps: this.hyperParameters.training_steps,
  //       // width: this.hyperParameters.width,
  //       // height: this.hyperParameters.height,
  //       // name: this.generalSettings.containerName,
  //     };
  //
  //   } else {
  //     this.config = {
  //       num_classes: this.hyperParameters.num_classes,
  //       batch_size: this.hyperParameters.batch_size,
  //       eval_steps: this.hyperParameters.eval_steps,
  //       learning_rate: this.hyperParameters.learning_rate,
  //       // network_architecture: this.generalSettings.networkArchitecture,
  //       training_steps: this.hyperParameters.training_steps,
  //       name: this.generalSettings.containerName,
  //     };
  //   }
  //   // if (this.checkPointsAvailable) {
  //   //   this.config.checkpoint_path = this.generalSettings.checkPointPath;
  //   // }
  //   return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.APIPort + '/config', this.config);
  // }

  // advancedHyperParametersValidator(configContent: AdvancedHyperParameters) {
  //   configContent.name = this.generalSettings.containerName;
  //   // configContent.network_architecture = this.generalSettings.networkArchitecture;
  //   // console.log(configContent);
  //   return this.http.post<HttpResponse<Config>>(this.serviceUrl + this.APIPort + '/config_advanced', configContent);
  // }


}
