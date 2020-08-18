import {Component, DoCheck, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {HyperParametersComponent} from './hyper-parameters/hyper-parameters.component';
import {PrepareDatasetsComponent} from './prepare-datasets/prepare-datasets.component';
import {ContainerSettingsComponent} from './container-settings/container-settings.component';
import {MatSnackBar, MatStepper} from '@angular/material';
import {DataValidatorService} from '../../../Services/data-validator.service';
import {IgeneralSettings} from '../../../Interfaces/Igeneral-settings';
import {IHyperParameters} from '../../../Interfaces/IHyperParameters';
import {IPrepareDataSet} from '../../../Interfaces/prepare-data-set';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Config} from 'codelyzer';
import {DataGetter} from '../../../Services/data-getter.service';
import {AdvancedHyperParametersComponent} from './advanced-hyper-parameters/advanced-hyper-parameters.component';
import {AdvancedHyperParameters} from '../../../Interfaces/advanced-hyper-parameters';
import {ConfigFileManagerService} from '../../../Services/config-file-manager.service';
import {JobsService} from '../../../Services/jobs.service';
import {Ijob} from '../../../Interfaces/ijob';
import {Router} from '@angular/router';
import {delay} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IConfig} from '../../../Interfaces/IConfig';


@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit , DoCheck , OnDestroy {

  // tslint:disable-next-line:max-line-length
  constructor(private dataValidatorService: DataValidatorService,
              private snackBar: MatSnackBar,
              private gpuGetterService: DataGetter,
              private configFileManager: ConfigFileManagerService,
              private JobService: JobsService,
              private router: Router,
              ) {}

  // @ts-ignore
  @ViewChild(HyperParametersComponent) hyperParameters: HyperParametersComponent;
  // @ts-ignore
  @ViewChild(AdvancedHyperParametersComponent) advancedHyperParameters: AdvancedHyperParametersComponent;
  // @ts-ignore
  @ViewChild(PrepareDatasetsComponent) prepareDataset: PrepareDatasetsComponent;
  // @ts-ignore
  @ViewChild(ContainerSettingsComponent) containerSettings: ContainerSettingsComponent;

  @Output() pageTitleOutput = new EventEmitter<string>();
  step = 0;
  pageTitle = 'Create Job';
  // hyperParameterData: IHyperParameters;
  // advancedHyperParameterData: AdvancedHyperParameters;
  // configFile = '';
  prepareDataSetData: IPrepareDataSet;
  generalSettingsData: IgeneralSettings = {
    containerName: '',
    APIPort: null
  };
  stepCompleted = false;
  nextButtonClicked = false;
  availableGPUs: number[];
  // showImageControl = true;
  // advancedOptions = false;
  // networkArchitectureThatDoesntRequireImageControl = ['frcnn_resnet_50', 'frcnn_resnet_101'];
  // defaultHyperParameters: IHyperParameters;
  jobs: string[];
  downloadableModels: string[] = [];
  firstStepEditable = false;

  configInfo: IConfig = {
    lr: 0.01,
    batch_size: 1,
    epochs: 1,
    gpus_count: [],
    processor: 'CPU',
    weights_type: '',
    weights_name: '',
    model_name: '',
    new_model: '',
  };

  ngOnInit() {
    this.pageTitleOutput.emit(this.pageTitle);
  }

  ngDoCheck(): void {
    // if ( this.prepareDataset.sendRequest === true) {
    //         this.dataValidatorService.getLabelsType(this.prepareDataset.FieldControl.value.datasetFolder).subscribe( message => {
    //           this.prepareDataset.labelTypes = message;
    //         } , error => {
    //           this.prepareDataset.labelTypes = [];
    //           this.snackBar.open('Invalid dataset' , '' , {duration: 2000, panelClass: 'redSnackBar'});
    //         });
    // }
  }

  ngOnDestroy(): void {
    this.JobService.runningDatasetFolder.next('');
    this.JobService.runningNetworkArchitecture.next('');
    this.JobService.runningJobName.next('');
    this.configFileManager.resetEnteringCreateJobComponent.next(0);
    // this.configFileManager.resetEnteringCreateJobComponentAvancedHyperParameters.next(0);
  }

  prepareData() {
    this.prepareDataset.prepareDatasetInterface.dataset_name = this.prepareDataset.FieldControl.value.dataset_name;
    console.log(this.prepareDataset.prepareDatasetInterface);
    if (this.prepareDataset.FieldControl.value.dataset_name === '' || this.prepareDataset.FieldControl.value.trainPercentage === null ||
        this.prepareDataset.FieldControl.value.validationPercentage === null || this.prepareDataset.FieldControl.value.testPercentage === null) {
      this.nextButtonClicked = false;
      this.snackBar.open('Please enter all the required values', '', {duration: 5000, panelClass: 'redSnackBar'});
    } else if (
        (this.prepareDataset.FieldControl.get('trainPercentage').hasError('isNotInRange') &&
          !this.prepareDataset.FieldControl.get('trainPercentage').hasError('required')) ||
        (this.prepareDataset.FieldControl.get('validationPercentage').hasError('isNotInRange') &&
          !this.prepareDataset.FieldControl.get('validationPercentage').hasError('required')) ||
        (this.prepareDataset.FieldControl.get('testPercentage').hasError('isNotInRange') &&
          !this.prepareDataset.FieldControl.get('testPercentage').hasError('required'))) {
      this.nextButtonClicked = false;
    } else if (this.prepareDataset.sum > 100 || this.prepareDataset.sum < 100) {
      this.nextButtonClicked = false;
      this.snackBar.open('Sum of split percentage is not 100', '', {duration: 5000, panelClass: 'redSnackBar'});
    } else {
      this.snackBar.open('Success !', '', {duration: 5000, panelClass: 'greenSnackBar'});
      this.stepCompleted = true;
      this.nextButtonClicked = true;
      setTimeout(() => {
        this.advanceStep();
      }, 100);
    }
  }

  // prepareDatasetValidator() {
  //
  //   if (this.prepareDataset.validateData() && !this.nextButtonClicked) {
  //     // this.firstStepEditable = true;
  //     this.JobService.runningDatasetFolder.next(this.prepareDataset.FieldControl.value.datasetFolder);
  //     // console.log(this.JobService.runningDatasetFolder);
  //     this.nextButtonClicked = true;
  //     this.stepCompleted = false;
  //     this.dataValidatorService.sendDatasetInfo(this.prepareDataSetData).subscribe((message: HttpResponse<Config>) => {
  //
  //         // @ts-ignore
  //         if (message === true) {
  //           this.snackBar.open('Success !', '', {duration: 5000, panelClass: 'greenSnackBar'});
  //           // getting Valid gPUs
  //
  //           this.gpuGetterService.getAvailableGPUs().subscribe((AvailableGPUsResponse: number[]) => {
  //             this.availableGPUs = AvailableGPUsResponse;
  //           }, error1 => this.handleError(error1));
  //           this.gpuGetterService.getAvailableNetworks().subscribe((AvailableNetworks: string[]) => {
  //             this.containerSettings.networksList = AvailableNetworks;
  //             this.stepCompleted = true;
  //             setTimeout(() => {
  //               this.advanceStep();
  //
  //             }, 100);
  //           }, error => this.handleError(error));
  //
  //         } else {
  //
  //           this.nextButtonClicked = false;
  //           this.snackBar.open('Invalid Dataset !', '', {duration: 5000, panelClass: 'redSnackBar'});
  //         }
  //       }, error2 => this.handleError(error2)
  //     );
  //   }
  // }

  addJobStep2() {
    this.JobService.runningJobName.next(this.containerSettings.FieldControl.value.containerName);
    this.nextButtonClicked = true;

    this.generalSettingsData.containerName = this.containerSettings.FieldControl.value.containerName;
    console.log(this.generalSettingsData.containerName);
    this.generalSettingsData.APIPort = this.containerSettings.FieldControl.value.APIPort;

    this.dataValidatorService.startJob(this.generalSettingsData).subscribe((startJobResponse: HttpResponse<Config>) => {

      this.stepCompleted = true;
      setTimeout(() => {
        this.advanceStep();

      }, 100);

    }, startJobError => this.handleError(startJobError));
  }

  generalSettings() {
    if (this.containerSettings.FieldControl.value.containerName !== '' &&
        this.containerSettings.FieldControl.value.weightType !== '' && this.containerSettings.selectedGPU.length !== 0) {
      this.configInfo.gpus_count = this.containerSettings.selectedGPU;
      this.configInfo.weights_type = this.containerSettings.selectedWeightType;
      if (this.containerSettings.selectedWeightType === 'from_scratch' || this.containerSettings.selectedWeightType === 'pre_trained') {
        if (this.containerSettings.FieldControl.value.networks !== '') {
          this.configInfo.weights_name = this.containerSettings.FieldControl.value.networks;
          this.addJobStep2();
        } else {
          this.snackBar.open('Please enter all the required values', '', {duration: 3000, panelClass: 'redSnackBar'});
        }
      } else if (this.containerSettings.selectedWeightType === 'checkpoint') {
        if (this.containerSettings.FieldControl.value.checkPoints !== '') {
          this.configInfo.model_name = this.containerSettings.FieldControl.value.checkPoints;
          this.addJobStep2();
        } else {
          this.snackBar.open('Please enter all the required values', '', {duration: 3000, panelClass: 'redSnackBar'});
        }
      }
    } else {
      this.snackBar.open('Please enter all the required values', '', {duration: 3000, panelClass: 'redSnackBar'});
    }
  }

  // generalSettingsValidator() {
  //
  //   if (this.containerSettings.validateData() && !this.nextButtonClicked) {
  //     // this.firstStepEditable = false;
  //     this.JobService.runningJobName.next(this.containerSettings.FieldControl.value.containerName);
  //     this.JobService.runningNetworkArchitecture.next(this.containerSettings.FieldControl.value.networkArchitecture);
  //     this.nextButtonClicked = true;
  //     this.dataValidatorService.startJob(this.generalSettingsData).subscribe((startJobResponse: HttpResponse<Config>) => {
  //       this.dataValidatorService.create_pbtxt().subscribe((responseMessage: HttpResponse<Config>) => {
  //         this.dataValidatorService.create_tfrecord().subscribe((message: HttpResponse<Config>) => {
  //           // this.testIfImageControlIsAvailable(this.generalSettingsData.networkArchitecture);
  //           // this.getHyperParametersDefaultValues();
  //
  //
  //
  //           this.JobService.getAllJobs().subscribe((jobs: string[]) => {
  //             this.jobs = jobs;
  //             this.JobService.jobs.next(jobs);
  //
  //             this.JobService.getDownloadableModels().subscribe((models: string[]) => {
  //               this.downloadableModels = models;
  //               this.JobService.downloadableModels.next(models);
  //
  //             }, error => this.handleError(error));
  //
  //
  //           }, error => this.handleError(error));
  //
  //
  //         }, error2 => this.handleError(error2));
  //       }, error1 => this.handleError(error1));
  //     }, startJobError => this.handleError(startJobError));
  //   } else {
  //     this.snackBar.open('Please enter all the required values', '', {duration: 3000, panelClass: 'redSnackBar'});
  //   }
  // }


  // getHyperParametersDefaultValues() {
  //   this.gpuGetterService.getDefaultValues(this.generalSettingsData.networkArchitecture,
  //     this.generalSettingsData.APIPort).subscribe((defaultValue: IHyperParameters) => {
  //     // console.log('defaultValue', defaultValue);
  //     this.defaultHyperParameters = defaultValue;
  //     this.stepCompleted = true;
  //     setTimeout(() => {
  //       this.advanceStep();
  //
  //     }, 100);
  //   }, error1 => this.handleError(error1));
  // }


  step3Validator() {
    if (this.hyperParameters.FieldControl.get('learning_rate').hasError('required') || this.hyperParameters.FieldControl.get('batch_size').hasError('required') ||
        this.hyperParameters.FieldControl.get('epochs').hasError('required')) {
      this.nextButtonClicked = false;
      this.snackBar.open('Please enter all the required values', '', {duration: 5000, panelClass: 'redSnackBar'});
    } else if (
        (this.hyperParameters.FieldControl.get('learning_rate').hasError('isNotFloat') &&
            !this.hyperParameters.FieldControl.get('learning_rate').hasError('required')) ||
        (this.hyperParameters.FieldControl.get('batch_size').hasError('isNotInteger') &&
            !this.hyperParameters.FieldControl.get('batch_size').hasError('required')) ||
        (this.hyperParameters.FieldControl.get('epochs').hasError('isNotInteger') &&
            !this.hyperParameters.FieldControl.get('epochs').hasError('required'))) {
      this.nextButtonClicked = false;
    } else {
      this.configInfo.lr = this.hyperParameters.FieldControl.value.learning_rate;
      this.configInfo.batch_size = this.hyperParameters.FieldControl.value.batch_size;
      this.configInfo.epochs = this.hyperParameters.FieldControl.value.epochs;
      this.configInfo.processor = 'CPU';
      this.configInfo.new_model = this.containerSettings.FieldControl.value.containerName;

      console.log(this.configInfo);
      console.log(this.prepareDataset.prepareDatasetInterface);

      this.dataValidatorService.datasetPost(this.prepareDataset.prepareDatasetInterface).subscribe((message: HttpResponse<Config>) => {
        this.dataValidatorService.configPost(this.configInfo).subscribe((message1: HttpResponse<Config>) => {
          this.JobService.getAllJobs().subscribe((jobs: string[]) => {
            this.jobs = jobs;

            this.JobService.getDownloadableModels().subscribe((models: string[]) => {
              this.downloadableModels = models;

              this.router.navigate(['/training']);

            }, error => this.handleError(error));


          }, error => this.handleError(error));
        }, error2 => this.handleError(error2));
      }, error2 => this.handleError(error2));
    }
  }

  // hyperParametersValidator() {
  //   if (this.advancedOptions) {
  //     if (this.advancedHyperParameters.validateData() && !this.nextButtonClicked) {
  //       this.nextButtonClicked = true;
  //       // tslint:disable-next-line:max-line-length
  //       if (Array.isArray(this.advancedHyperParameterData.content)) {
  //       this.advancedHyperParameterData.content = this.advancedHyperParameterData.content[0];
  //     }
  //       // tslint:disable-next-line:max-line-length
  //       this.dataValidatorService.advancedHyperParametersValidator(this.advancedHyperParameterData).subscribe((message: HttpResponse<Config>) => {
  //         this.stepCompleted = true;
  //         setTimeout(() => {
  //           this.advanceStep();
  //
  //         }, 100);
  //         this.snackBar.open(this.generalSettingsData.containerName + ' Started  on GPU ' +
  //           this.generalSettingsData.gPUs,
  //           '', {duration: 6000, panelClass: 'greenBar'});
  //       }, error2 => this.handleError(error2));
  //     }
  //   } else {
  //     if (this.hyperParameters.validateData() && !this.nextButtonClicked) {
  //
  //       this.nextButtonClicked = true;
  //       this.dataValidatorService.hyperParametersValidator(this.hyperParameterData).subscribe((message: HttpResponse<Config>) => {
  //         this.stepCompleted = true;
  //         setTimeout(() => {
  //           this.nextButtonClicked = false;
  //           document.getElementById('hyperParametersNextButton').click();
  //           this.stepCompleted = false;
  //         }, 100);
  //
  //         this.snackBar.open(this.generalSettingsData.containerName + ' Started  on GPU ' +
  //           this.generalSettingsData.gPUs, '', {duration: 6000, panelClass: 'greenBar'});
  //       }, error2 => this.handleError(error2));
  //     }
  //   }
  // }

  handleError(errorResponse: HttpErrorResponse) {
    this.nextButtonClicked = false;
    if (errorResponse.status === 404) {
      // A client-side or network error occurred. Handle it accordingly.
      this.snackBar.open('API unreachable', '', {duration: 3000, panelClass: 'redSnackBar'});
    }
    if (errorResponse.status === 400) {
      this.snackBar.open('Bad Request', '', {duration: 3000, panelClass: 'redSnackBar'});
    }
    if (errorResponse.status === 422) {
      this.snackBar.open('Validation error', '', {duration: 3000, panelClass: 'redSnackBar'});
    }
    if (errorResponse.status === 500) {
      this.snackBar.open('internal server error', '', {duration: 3000, panelClass: 'redSnackBar'});
    } else {
      this.snackBar.open(errorResponse.message, '', {duration: 3000, panelClass: 'redSnackBar'});
    }

    return throwError(
      'Something bad happened; please try again later.');
  }

  // testIfImageControlIsAvailable(networkArchitecture) {
  //   if (this.networkArchitectureThatDoesntRequireImageControl.includes(networkArchitecture)) {
  //     this.showImageControl = false;
  //     this.dataValidatorService.sendImageControl = false;
  //   } else {
  //     this.dataValidatorService.sendImageControl = true;
  //   }
  // }

  // advanceOptionToggle() {
  //   const apiPort = +this.generalSettingsData.APIPort;
  //   console.log('the api port field is : ', this.generalSettingsData.APIPort);
  //   console.log('the api port field is : ', apiPort);
  //
  //
  //   this.configFileManager.getConfigFile(apiPort, this.generalSettingsData.networkArchitecture).subscribe((configFile: object) => {
  //
  //     // @ts-ignore
  //     this.configFile = configFile.content;
  //     this.advancedOptions = !this.advancedOptions;
  //   });
  // }

  advanceStep() {
    if (this.step === 2) {
      document.getElementById('hyperParametersNextButton').click();
    }
    this.step++;
    this.nextButtonClicked = false;
    this.stepCompleted = false;
  }


  cancelJob() {

    this.nextButtonClicked = true;
    this.JobService.getAllJobs().subscribe((jobs: string[]) => {
      this.jobs = jobs;
      this.JobService.jobs.next(jobs);

      this.JobService.getDownloadableModels().subscribe((models: string[]) => {
        this.downloadableModels = models;
        this.JobService.downloadableModels.next(models);


        const job: Ijob = {
          name: this.jobs[0]
        };


        this.JobService.stopJob(job).subscribe(() => {

          this.nextButtonClicked = false;

          this.snackBar.open('Job Deleted !', '', {duration: 4000});

          this.router.navigate(['/training']);


        }, error => this.handleError(error));



      }, error => this.handleError(error));

    }, error => this.handleError(error));



  }

  openHome() {
    window.open('training');
  }


  goBackStepper() {

     this.firstStepEditable = true;

     setTimeout(() => {
      this.step = 0;
      this.firstStepEditable = false;

    }, 1);
  }

}


