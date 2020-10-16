import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {PrepareDatasetComponent} from './forms/prepare-dataset/prepare-dataset.component';
import {GeneralSettingsComponent} from './forms/general-settings/general-settings.component';
import {HyperParametersComponent} from './forms/hyper-parameters/hyper-parameters.component';
import {DataGetterFirstApiService} from '../../Services/data-getter-first-api.service';
import {environment} from '../../../environments/environment';
import {AddJob} from '../../Interfaces/addJob';
import {DataSenderFirstApiService} from '../../Services/data-sender-first-api.service';
import {RemoveJob} from '../../Interfaces/removeJob';
import {IConfig} from '../../Interfaces/config';
import {BasicConfig} from '../../Interfaces/basicConfig';
import {HttpResponse} from '@angular/common/http';
import {Dataset} from '../../Interfaces/dataset';
import {Config} from 'codelyzer';
import {DataSenderSecondApiService} from '../../Services/data-sender-second-api.service';
import {AdvancedHyperParametersComponent} from './forms/advanced-hyper-parameters/advanced-hyper-parameters.component';
import {NzMessageService} from 'ng-zorro-antd';
import set = Reflect.set;
import {Router} from '@angular/router';

@Component({
  selector: 'app-stepper-page',
  templateUrl: './stepper-page.component.html',
  styleUrls: ['./stepper-page.component.css']
})
export class StepperPageComponent implements OnInit, OnDestroy{
  @ViewChild(PrepareDatasetComponent) prepareDataset: PrepareDatasetComponent;
  @ViewChild(GeneralSettingsComponent) generalSettings: GeneralSettingsComponent;
  @ViewChild(HyperParametersComponent) hyperParameters: HyperParametersComponent;
  @ViewChild(AdvancedHyperParametersComponent) advancedHyperParameters: AdvancedHyperParametersComponent;

  current = 0;
  card1Hidden = false;
  card2Hidden = true;
  card3Hidden = true;
  card4Hidden = true;
  step2PreviousButtonDisabled: boolean;
  step2NextButtonLoading: boolean;
  doneButtonLoading: boolean;
  cancelButtonDisabled: boolean;
  switchState: boolean;
  hyperParametersHidden = false;
  advancedHyperParametersHidden = true;

  baseURL = environment.url;
  basedEndPoint = environment.baseEndPoint;

  URL = this.baseURL + this.basedEndPoint + '/models/';

  allJobs: Array<string> = [];
  downloadableModels: any;
  downloadableModelsKey = [];
  downloadableModelsValue = [];

  addJob: AddJob = {
    name: '',
    api_port: 0,
    gpus_count: []
  };

  removeJob: RemoveJob = {
    name: ''
  };

  advancedConfig: IConfig = {
    lr: 0,
    batch_size: 0,
    epochs: 0,
    gpus_count: [],
    processor: '',
    weights_type: '',
    weights_name: '',
    model_name: '',
    new_model: '',
    momentum: 0,
    wd: 0,
    lr_factor: 0,
    num_workers: 0,
    jitter_param: 0,
    lighting_param: 0,
    Xavier: null,
    MSRAPrelu: null,
    data_augmenting: null,
  };

  basicConfig: BasicConfig = {
    lr: 0,
    batch_size: 0,
    epochs: 0,
    gpus_count: [],
    processor: '',
    weights_type: '',
    weights_name: '',
    model_name: '',
    new_model: '',
  };


  dataset: Dataset = {
    dataset_name: '',
    training_ratio: 0,
    validation_ratio: 0,
    testing_ratio: 0
  };

  interval;
  finishedJobs: Array<string> = [];

  dot;
  exactValue;

  jobMessageValue = '';

  mobile: boolean;

  popoverPlacement;

  // cancel(), per(), next() and done() are all linked to the nz action buttons

  cancel(): void {
    this.removeJob.name = this.generalSettings.validateForm.value.containerName;
    this.dataSenderFirstApi.removeJob(this.removeJob).subscribe();
  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    if (this.current === 0) {
      this.prepareDataset.submitForm(this.prepareDataset.validateForm.value);
      if (!this.prepareDataset.validateForm.valid){
        // do nothing
      } else if (this.prepareDataset.sum !== 100) {
        this.message.error('Sum of split percentage is not 100', {
          nzDuration: 3000
        });
      } else {
        this.current += 1;
        this.changeContent();
      }
    } else if (this.current === 1) {
      this.generalSettings.submitForm(this.generalSettings.validateForm.value);
      if (!this.generalSettings.validateForm.valid){
        // do nothing
      } else {
        this.addJob.name = this.generalSettings.validateForm.value.containerName;
        this.addJob.api_port = this.generalSettings.validateForm.value.APIPort;
        this.addJob.gpus_count = this.generalSettings.validateForm.value.gpus_count;

        this.generalSettings.containerNameDisabled = true;
        this.generalSettings.gpusCountDisabled = true;
        this.generalSettings.weightTypeDisabled = true;
        this.generalSettings.networksDisabled = true;
        this.generalSettings.checkpointsDisabled = true;

        this.step2PreviousButtonDisabled = true;
        this.step2NextButtonLoading = true;

        // @ts-ignore
        this.dataSenderFirstApi.addJob(this.addJob).subscribe((message1: string) => {

          this.jobMessageValue = message1;

          if (this.jobMessageValue === 'Success') {
            setTimeout( () => {
              this.current += 1;
              this.changeContent();

              this.cancelButtonDisabled = true;
              this.doneButtonLoading = true;

              setTimeout(() => {
                this.cancelButtonDisabled = false;
                this.doneButtonLoading = false;
              }, 3000);

            }, 0);
          }
        });

        this.dataGetterFirstApi.getAllJobs().subscribe(allJobs => {
          this.allJobs = allJobs;
        });


      }
    }
  }

  done(): void {
    if (this.hyperParametersHidden === true) {
        this.advancedHyperParameters.submitForm(this.advancedHyperParameters.validateForm.value);
        if (!this.advancedHyperParameters.validateForm.valid){
          // do nothing
        } else {
          this.advancedConfig.lr = this.advancedHyperParameters.validateForm.value.learning_rate;
          this.advancedConfig.batch_size = this.advancedHyperParameters.validateForm.value.batch_size;
          this.advancedConfig.epochs = this.advancedHyperParameters.validateForm.value.epochs;
          this.advancedConfig.momentum = this.advancedHyperParameters.validateForm.value.momentum;
          this.advancedConfig.wd = this.advancedHyperParameters.validateForm.value.wd;
          this.advancedConfig.lr_factor = this.advancedHyperParameters.validateForm.value.lr_factor;
          this.advancedConfig.num_workers = this.advancedHyperParameters.validateForm.value.num_workers;
          this.advancedConfig.jitter_param = this.advancedHyperParameters.validateForm.value.jitter_param;
          this.advancedConfig.lighting_param = this.advancedHyperParameters.validateForm.value.lighting_param;
          this.advancedConfig.Xavier = this.advancedHyperParameters.validateForm.value.Xavier;
          this.advancedConfig.MSRAPrelu = this.advancedHyperParameters.validateForm.value.MSRAPrelu;
          this.advancedConfig.data_augmenting = this.advancedHyperParameters.validateForm.value.data_augmenting;
          this.advancedConfig.processor = this.advancedHyperParameters.validateForm.value.processor;
          this.advancedConfig.new_model = this.generalSettings.validateForm.value.containerName;
          this.advancedConfig.gpus_count = this.generalSettings.validateForm.value.gpus_count;

          this.dataset.dataset_name = this.prepareDataset.validateForm.value.dataset_name;
          this.dataset.training_ratio = this.prepareDataset.validateForm.value.training;
          this.dataset.validation_ratio = this.prepareDataset.validateForm.value.validation;
          this.dataset.testing_ratio = this.prepareDataset.validateForm.value.testing;

          if (this.generalSettings.validateForm.value.weightType === 'from_scratch' || this.generalSettings.validateForm.value.weightType === 'pre_trained') {
              this.advancedConfig.weights_type = this.generalSettings.validateForm.value.weightType;
              this.advancedConfig.weights_name = this.generalSettings.validateForm.value.networks;
          } else {
              this.advancedConfig.weights_type = this.generalSettings.validateForm.value.weightType;
              this.advancedConfig.model_name = this.generalSettings.validateForm.value.checkPoints;
              this.advancedConfig.weights_name = this.generalSettings.selectedCheckpointValue;
          }

          this.dataSenderSecondApi.datasetPost(this.dataset, this.generalSettings.validateForm.value.APIPort).subscribe(
            (message: HttpResponse<Config>) => {
                this.dataSenderSecondApi.advancedConfigPost(this.advancedConfig, this.generalSettings.validateForm.value.APIPort).subscribe(
                  (message1: HttpResponse<Config>) => {
                  });
            });

          this.current += 1;
          this.changeContent();
          this.router.navigate(['/jobs']);
        }
      } else {
        this.hyperParameters.submitForm(this.hyperParameters.validateForm.value);
        if (!this.hyperParameters.validateForm.valid){
          // do nothing
        } else {
          this.basicConfig.lr = this.hyperParameters.validateForm.value.learning_rate;
          this.basicConfig.batch_size = this.hyperParameters.validateForm.value.batch_size;
          this.basicConfig.epochs = this.hyperParameters.validateForm.value.epochs;
          this.basicConfig.new_model = this.generalSettings.validateForm.value.containerName;
          this.basicConfig.gpus_count = this.generalSettings.validateForm.value.gpus_count;
          this.basicConfig.processor = this.advancedHyperParameters.validateForm.value.processor;

          this.dataset.dataset_name = this.prepareDataset.validateForm.value.dataset_name;
          this.dataset.training_ratio = this.prepareDataset.validateForm.value.training;
          this.dataset.validation_ratio = this.prepareDataset.validateForm.value.validation;
          this.dataset.testing_ratio = this.prepareDataset.validateForm.value.testing;

          // tslint:disable-next-line:max-line-length
          if (this.generalSettings.validateForm.value.weightType === 'from_scratch' || this.generalSettings.validateForm.value.weightType === 'pre_trained') {
              this.basicConfig.weights_type = this.generalSettings.validateForm.value.weightType;
              this.basicConfig.weights_name = this.generalSettings.validateForm.value.networks;
          } else {
              this.basicConfig.weights_type = this.generalSettings.validateForm.value.weightType;
              this.basicConfig.model_name = this.generalSettings.validateForm.value.checkPoints;
              this.basicConfig.weights_name = this.generalSettings.selectedCheckpointValue;
          }

          this.dataSenderSecondApi.datasetPost(this.dataset, this.generalSettings.validateForm.value.APIPort).subscribe(
            (message: HttpResponse<Config>) => {
                this.dataSenderSecondApi.basicConfigPost(this.basicConfig, this.generalSettings.validateForm.value.APIPort).subscribe(
                  (message1: HttpResponse<Config>) => {
                  });
            });

          this.current += 1;
          this.changeContent();
          this.router.navigate(['/jobs']);
        }
      }
  }


  // change content of each step
  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.card1Hidden = false;
        this.card2Hidden = true;
        this.card3Hidden = true;
        this.card4Hidden = true;
        this.step2PreviousButtonDisabled = false;
        this.step2NextButtonLoading = false;
        break;
      }
      case 1: {
        this.card1Hidden = true;
        this.card2Hidden = false;
        this.card3Hidden = true;
        this.card4Hidden = true;
        this.step2PreviousButtonDisabled = false;
        this.step2NextButtonLoading = false;
        break;
      }
      case 2: {
        this.card1Hidden = true;
        this.card2Hidden = true;
        this.card3Hidden = false;
        this.card4Hidden = true;
        this.step2PreviousButtonDisabled = true;
        this.step2NextButtonLoading = false;
        break;
      }
      case 3: {
        this.card1Hidden = true;
        this.card2Hidden = true;
        this.card3Hidden = true;
        this.card4Hidden = false;
        break;
      }
      default: {
      }
    }
  }

  testWithSwagger(){
    window.open(environment.inferenceAPIUrl, '_blank');
  }

  jobIsDone = (jobs: string) => {
    if (this.finishedJobs !== undefined) {
      return this.finishedJobs.indexOf(jobs);
    }
    return -1;
  }

  // switch between hyper and advanced hyper parameters
  switch() {
    this.switchState = !this.switchState;
    if (this.switchState === true) {
      this.hyperParametersHidden = true;
      this.advancedHyperParametersHidden = false;
    } else {
      this.hyperParametersHidden = false;
      this.advancedHyperParametersHidden = true;
    }
  }

  onDownloadableModelClick() {
    this.dot = false;
    if (this.mobile === false) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.downloadableModelsKey.length; i++){
        if (this.downloadableModelsKey[i].slice(0, -4).length > 6) {
          this.popoverPlacement = 'bottomRight';
          break;
        } else {
          this.popoverPlacement = 'bottom';
        }
      }
    }
  }

  constructor(private dataGetterFirstApi: DataGetterFirstApiService,
              private dataSenderFirstApi: DataSenderFirstApiService,
              private dataSenderSecondApi: DataSenderSecondApiService,
              private message: NzMessageService,
              private router: Router) {
    this.interval = setInterval(() => {
      this.dataGetterFirstApi.getFinishedJobs().subscribe((finishedJobs) => {
        if (finishedJobs.length > this.finishedJobs.length) {
          this.dot = true;
        }
        this.finishedJobs = finishedJobs;
      });
      this.dataGetterFirstApi.getDownloadableModels().subscribe((downloadableModels) => {
        this.downloadableModels = downloadableModels;

        const extraKey = [];
        let missingKey;

        for (const [key, value] of Object.entries(this.downloadableModels)) {
          extraKey.push(key);
          if (!extraKey.every(n => this.downloadableModelsKey.includes(missingKey = n))) {
            this.exactValue = value;
            this.downloadableModelsKey.push(missingKey);
          }
        }
        if (this.exactValue !== undefined) {
          this.downloadableModelsValue.push(this.exactValue);
        }
      });
    }, 5000);
  }

  ngOnInit() {

    if (window.screen.width < 769) { // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }

    window.onresize = () => {
      if (window.screen.width < 769) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };

    this.dataGetterFirstApi.getDownloadableModels().subscribe((models) => {
      this.downloadableModels = models;

      for (const [key, value] of Object.entries(this.downloadableModels)) {
        this.downloadableModelsKey.push(key);
        this.downloadableModelsValue.push(value);
      }

    });

    this.dataGetterFirstApi.getFinishedJobs().subscribe((finishedJobs) => {
      this.finishedJobs = finishedJobs;
    });

    this.dataGetterFirstApi.getAllJobs().subscribe(allJobs => {
      this.allJobs = allJobs;
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
