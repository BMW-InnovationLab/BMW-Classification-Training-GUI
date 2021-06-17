import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PrepareDatasetComponent} from './components/prepare-dataset/prepare-dataset.component';
import {GeneralSettingsComponent} from './components/general-settings/general-settings.component';
import {HyperParametersComponent} from './components/hyper-parameters/hyper-parameters.component';
import {DataGetterFirstApiService} from '../../core/services/data-getter-first-api.service';
import {AddJob} from '../../core/domain/models/add-job';
import {DataSenderFirstApiService} from '../../core/services/data-sender-first-api.service';
import {RemoveJob} from '../../core/domain/models/remove-job';
import {AdvancedConfig} from '../../core/domain/models/config';
import {BasicConfig} from '../../core/domain/models/basic-config';
import {Dataset} from '../../core/domain/models/dataset';
import {DataSenderSecondApiService} from '../../core/services/data-sender-second-api.service';
import {AdvancedHyperParametersComponent} from './components/advanced-hyper-parameters/advanced-hyper-parameters.component';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {forkJoin} from 'rxjs';
import {concatMap, tap} from 'rxjs/operators';
import {HeaderTitle} from '../../core/domain/enums/header-title';
import {environment} from '../../../environments/environment.prod';
import {retryWithDelay} from 'rxjs-boost/lib/operators';

@Component({
    selector: 'app-stepper-page',
    templateUrl: './stepper-page.component.html',
    styleUrls: ['./stepper-page.component.css']
})
export class StepperPageComponent implements OnInit, OnDestroy {
    @ViewChild(PrepareDatasetComponent) prepareDataset: PrepareDatasetComponent;
    @ViewChild(GeneralSettingsComponent) generalSettings: GeneralSettingsComponent;
    @ViewChild(HyperParametersComponent) hyperParameters: HyperParametersComponent;
    @ViewChild(AdvancedHyperParametersComponent) advancedHyperParameters: AdvancedHyperParametersComponent;
    private addJob: AddJob = new AddJob();
    private removeJob: RemoveJob = new RemoveJob();
    private advancedConfig: AdvancedConfig = new AdvancedConfig();
    private basicConfig: BasicConfig = new BasicConfig();
    private dataset: Dataset = new Dataset();
    private interval;
    public readonly title = HeaderTitle.CREATE;
    public current = 0;
    public step2PreviousButtonDisabled: boolean;
    public step2NextButtonLoading: boolean;
    public doneButtonLoading: boolean;
    public cancelButtonDisabled: boolean;
    public switchState: boolean;
    public allJobs: Array<string> = [];
    public downloadableModels = [];
    public finishedJobs: Array<string> = [];
    public mobile: boolean;

    constructor(private dataGetterFirstApi: DataGetterFirstApiService,
                private dataSenderFirstApi: DataSenderFirstApiService,
                private dataSenderSecondApi: DataSenderSecondApiService,
                private message: NzMessageService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.initializeScreenSettings();
        this.getJobs();
        this.initPage();
        this.interval = setInterval(this.initPage, 5000);
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    private initializeScreenSettings() {
        this.mobile = window.screen.width <= 768;
        window.onresize = () => {
            this.mobile = window.screen.width <= 768;
        };
    }

    private getJobs(): void {
        this.dataGetterFirstApi.getAllJobs()
            .subscribe((allJobs) => {
                this.allJobs = allJobs;
            }, (error) => {
                this.message.error(error);
            });
    }

    private initPage = () => {
        return forkJoin([
            this.dataGetterFirstApi.getFinishedJobs()
                .pipe(tap((finishedJobs) => this.finishedJobs = finishedJobs)),
            this.dataGetterFirstApi.getDownloadableModels()
                .pipe(tap((models) => this.downloadableModels = models))
        ]).subscribe(() => {
        }, (error) => {
            this.message.error(error);
        });
    }

    // change content of each step
    private changeContent(): void {
        this.step2NextButtonLoading = false;
        this.step2PreviousButtonDisabled = this.current === 2;
    }

    public cancel(): void {
        this.removeJob.name = this.generalSettings.validateForm.value.name;
        this.dataSenderFirstApi.removeJob(this.removeJob)
            .subscribe(() => {
            }, (error) => {
                this.message.error(error);
            });
    }

    public pre(): void {
        this.current -= 1;
        this.changeContent();
    }

    public next(): void {
        if (this.current === 0) {
            if (this.prepareDataset.formValid()) {
                this.generalSettings.datasetIndex = null;
                this.generalSettings.datasetValue = [];
                this.generalSettings.datasetIndex = this.prepareDataset.availableFoldersKeys
                    .indexOf(this.prepareDataset.prepareDatasetForm.value.dataset_name);
                this.generalSettings.datasetValue = this.prepareDataset.availableFoldersValue[this.generalSettings.datasetIndex];

                if (this.generalSettings.selectedWeightType === 'checkpoint') {
                    this.generalSettings.checkpointsList = [];
                    let index;
                    for (let i = 0; i < this.generalSettings.checkpointsValue.length; i++) {
                        if (this.generalSettings.checkpointsValue[i].length === this.generalSettings.datasetValue.length) {
                            // tslint:disable-next-line:prefer-for-of
                            for (let j = 0; j < this.generalSettings.datasetValue.length; j++) {
                                if (this.generalSettings.checkpointsValue[i].includes(this.generalSettings.datasetValue[j])) {
                                    index = 1;
                                } else {
                                    index = 0;
                                    break;
                                }
                            }
                            if (index === 1) {
                                // tslint:disable-next-line:max-line-length
                                this.generalSettings.checkpointsList
                                    .push(this.generalSettings.checkpointsKeys[i].split('/')[1]
                                        + ' | ' + this.generalSettings.checkpointsKeys[i].split('/')[0]);
                            }
                        }
                    }
                }
                this.current += 1;
                this.changeContent();
            }
        } else if (this.current === 1) {
            this.generalSettings.submitForm(this.generalSettings.validateForm.value);
            if (!this.generalSettings.validateForm.valid) {
                // do nothing
            } else {
                this.addJob.name = this.generalSettings.validateForm.value.name;
                this.addJob.api_port = this.generalSettings.validateForm.value.api_port;
                this.addJob.gpus_count = this.generalSettings.validateForm.value.gpus_count;

                this.generalSettings.containerNameDisabled = true;
                this.generalSettings.gpusCountDisabled = true;
                this.generalSettings.weightTypeDisabled = true;
                this.generalSettings.networksDisabled = true;
                this.generalSettings.checkpointsDisabled = true;

                this.step2PreviousButtonDisabled = true;
                this.step2NextButtonLoading = true;

                const handleError = (e) => {
                    this.cancel();
                    this.router.navigate(['/jobs']).then(() => this.message.error(e));
                };

                // @ts-ignore
                this.dataSenderFirstApi.addJob(this.addJob).subscribe((message: string) => {
                    if (message === 'Success') {
                        // setTimeout(() => {
                        this.current += 1;
                        this.changeContent();
                        // }, 8000);
                    }
                    else{
                        handleError('Could not add.');
                    }
                }, error => {
                    handleError(error);
                });
                this.getJobs();
            }
        }
    }

    private handleNewJob(response) {
        if (response.toString() === 'Training Started') {
            this.doneButtonLoading = false;
            this.current += 1;
            this.changeContent();
            this.router.navigate(['/jobs']);
        } else {
            this.doneButtonLoading = true;
        }
    }

    public done(): void {
        if (this.switchState === true) {
            if (this.advancedHyperParameters.formValid()) {
                this.advancedConfig.lr = this.advancedHyperParameters.advancedParametersForm.value.lr;
                this.advancedConfig.batch_size = this.advancedHyperParameters.advancedParametersForm.value.batch_size;
                this.advancedConfig.epochs = this.advancedHyperParameters.advancedParametersForm.value.epochs;
                this.advancedConfig.momentum = this.advancedHyperParameters.advancedParametersForm.value.momentum;
                this.advancedConfig.wd = this.advancedHyperParameters.advancedParametersForm.value.wd;
                this.advancedConfig.lr_factor = this.advancedHyperParameters.advancedParametersForm.value.lr_factor;
                this.advancedConfig.num_workers = this.advancedHyperParameters.advancedParametersForm.value.num_workers;
                this.advancedConfig.jitter_param = this.advancedHyperParameters.advancedParametersForm.value.jitter_param;
                this.advancedConfig.lighting_param = this.advancedHyperParameters.advancedParametersForm.value.lighting_param;
                this.advancedConfig.Xavier = this.advancedHyperParameters.advancedParametersForm.value.Xavier;
                this.advancedConfig.MSRAPrelu = this.advancedHyperParameters.advancedParametersForm.value.MSRAPrelu;
                this.advancedConfig.data_augmenting = this.advancedHyperParameters.advancedParametersForm.value.data_augmenting;
                this.advancedConfig.processor = this.advancedHyperParameters.advancedParametersForm.value.processor;
                this.advancedConfig.new_model = this.generalSettings.validateForm.value.name;
                this.advancedConfig.gpus_count = this.generalSettings.validateForm.value.gpus_count;

                this.dataset.dataset_name = this.prepareDataset.prepareDatasetForm.value.dataset_name;
                this.dataset.training_ratio = this.prepareDataset.prepareDatasetForm.value.training_ratio;
                this.dataset.validation_ratio = this.prepareDataset.prepareDatasetForm.value.validation_ratio;
                this.dataset.testing_ratio = this.prepareDataset.prepareDatasetForm.value.testing_ratio;

                const weightType = this.generalSettings.validateForm.value.weightType;
                if (weightType === 'from_scratch' || weightType === 'pre_trained') {
                    this.advancedConfig.weights_type = this.generalSettings.validateForm.value.weightType;
                    this.advancedConfig.weights_name = this.generalSettings.validateForm.value.networks;
                } else {
                    this.advancedConfig.weights_type = this.generalSettings.validateForm.value.weightType;
                    this.advancedConfig.model_name = this.generalSettings.validateForm.value.checkPoints.split('/')[1];
                    this.advancedConfig.weights_name = this.generalSettings.validateForm.value.checkPoints.split('/')[0];
                }

                this.doneButtonLoading = true;
                this.launchJob('advanced');
            }
        } else {
            if (this.hyperParameters.formValid()) {
                this.basicConfig.lr = this.hyperParameters.hyperparameterForm.value.lr;
                this.basicConfig.batch_size = this.hyperParameters.hyperparameterForm.value.batch_size;
                this.basicConfig.epochs = this.hyperParameters.hyperparameterForm.value.epochs;
                this.basicConfig.new_model = this.generalSettings.validateForm.value.name;
                this.basicConfig.gpus_count = this.generalSettings.validateForm.value.gpus_count;
                this.basicConfig.processor = this.advancedHyperParameters.advancedParametersForm.value.processor;
                this.dataset = Object.assign(this.prepareDataset.prepareDatasetForm.value);

                const weightType = this.generalSettings.validateForm.value.weightType;
                if (weightType === 'from_scratch' || weightType === 'pre_trained') {
                    this.basicConfig.weights_type = this.generalSettings.validateForm.value.weightType;
                    this.basicConfig.weights_name = this.generalSettings.validateForm.value.networks;
                } else {
                    this.basicConfig.weights_type = this.generalSettings.validateForm.value.weightType;
                    this.basicConfig.model_name = this.generalSettings.validateForm.value.checkPoints.split('/')[1];
                    this.basicConfig.weights_name = this.generalSettings.validateForm.value.checkPoints.split('/')[0];
                }

                this.doneButtonLoading = true;
                this.launchJob('basic');
            }
        }
    }

    private launchJob(requestType: 'basic' | 'advanced') {
        const port = this.generalSettings.validateForm.value.api_port;
        const innerRequest = (requestType === 'basic') ? this.dataSenderSecondApi.basicConfigPost(this.basicConfig, port) :
            this.dataSenderSecondApi.advancedConfigPost(this.advancedConfig, port);
        const endpoint = environment.url + this.generalSettings.validateForm.value.api_port + '/get';
        const handleError = (e) => {
            this.cancel();
            this.router.navigate(['/jobs']).then(() => this.message.error(e));
        };

        const errorTimout = setTimeout(() => handleError('Request timeout, please try again'), 30000);

        this.dataGetterFirstApi.checkIfReachable(endpoint).pipe(retryWithDelay(5000, 5))
            .subscribe( _ => {
                this.dataSenderSecondApi.datasetPost(this.dataset, this.generalSettings.validateForm.value.api_port)
                    .pipe(concatMap((_) => innerRequest))
                    .subscribe((response) => {
                        clearTimeout(errorTimout);
                        this.handleNewJob(response);
                    }, (e) => {
                        handleError(e);
                    });
            });
    }

    // switch between hyper and advanced hyper parameters
    public switch() {
        this.switchState = !this.switchState;
    }
}
