import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {DataGetterFirstApiService} from '../../../../core/services/data-getter-first-api.service';
import {forkJoin, Observable, Observer} from 'rxjs';
import {PrepareDatasetComponent} from '../prepare-dataset/prepare-dataset.component';
import {tap} from 'rxjs/operators';
import {NzMessageService} from 'ng-zorro-antd/message';

interface WeightType {
  name: string;
  value: string;
}

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})

export class GeneralSettingsComponent implements OnInit {
  @ViewChild(PrepareDatasetComponent) prepareDataset: PrepareDatasetComponent;
  public validateForm: FormGroup;
  public availableGPUs: Array<number> = [];
  public selectedGPUs: Array<number> = [];
  public disableSelection = false;

  usedPorts: Array<string> = [];
  randomPort = '';

  weightTypes: WeightType[] = [
    {name: 'from scratch' , value: 'from_scratch'},
    {name: 'transfer learning based on the ImageNet pretrained weights' , value: 'pre_trained'},
    {name: 'transfer learning based on the custom weights' , value: 'pretrained_offline'},
    {name: 'from checkpoint' , value: 'checkpoint'}
  ];

  selectedWeightType: string;
  networksList: Array<string> = [];
  checkpointsList = [];
  checkpointsKeys = [];
  checkpointsValue = [];
  networksHidden = true;
  checkpointsHidden = true;
  downloadableModels: any;
  downloadableModelsKey = [];
  downloadableModelsValue = [];

  runningJobs: Array<string> = [];

  selectedCheckpointValue;
  weightTypeTooltip = 'Choose the desired training method';

  containerNameDisabled = false;
  gpusCountDisabled = false;
  weightTypeDisabled = false;
  networksDisabled = false;
  checkpointsDisabled = false;

  datasetIndex: number;
  datasetValue = [];

  constructor(private fb: FormBuilder,
              private dataGetterFirstApi: DataGetterFirstApiService,
              private message: NzMessageService) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required], [this.userNameAsyncValidator]],
      gpus_count: [[], [Validators.required]],
      api_port: [0, [Validators.required]],
      weightType: ['', Validators.required],
      networks: [],
      checkPoints: [],
    });
  }


  ngOnInit(): void {
    this.initPage();
  }

  private initPage = () => {
    return forkJoin([
      this.dataGetterFirstApi.getAvailableGPUs()
          .pipe(tap((availableGPUs) => {
            this.availableGPUs = availableGPUs;
          })),
      this.dataGetterFirstApi.getUsedPorts()
          .pipe(tap((usedPorts) => {
            this.usedPorts = usedPorts;
            this.randomPort = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < usedPorts.length; i++) {
              if (this.randomPort === usedPorts[i]) {
                this.randomPort = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
              } else {
                this.validateForm.controls.api_port.setValue(Number(this.randomPort));
              }
            }
          })),
      this.dataGetterFirstApi.getAvailableNetworks()
          .pipe(tap((availableNetworks) => this.networksList = availableNetworks)),
      this.dataGetterFirstApi.getAvailableCheckPoints()
          .pipe(tap((availableCheckpoints) => {
            for (const [key, value] of Object.entries(availableCheckpoints)) {
              this.checkpointsKeys.push(key);
              this.checkpointsValue.push(value);
            }
          })),
      this.dataGetterFirstApi.getDownloadableModels()
          .pipe(tap((models) => {
            this.downloadableModels = models;

            for (const [key, value] of Object.entries(this.downloadableModels)) {
              this.downloadableModelsKey.push(key);
              this.downloadableModelsValue.push(value);
            }
          })),
      this.dataGetterFirstApi.getAllJobs()
          .pipe(tap((jobs) => this.runningJobs = jobs)),
    ]).subscribe(() => {}, (e) => this.message.error(e));
  }

  public excludedCharacters(val){
    this.validateForm.get('name').setAsyncValidators(this.userNameAsyncValidator);
    if (/[/\\^\[\]|`]/.test(val.key)) {
      val.preventDefault();
    }
  }

  public userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      let val = 0;
      setTimeout(() => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.downloadableModelsKey.length; i++) {
          if (control.value === this.downloadableModelsKey[i].slice(0, -4)) {
            val = 1;
          }
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.runningJobs.length; i++) {
          if (control.value === this.runningJobs[i]) {
            val = 1;
          }
        }
        if (val === 1) {
          observer.next({error: true, duplicated: true});
        } else {
          this.validateForm.get('name').clearAsyncValidators();
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    })

  public onWeightSelection() {
    if (this.selectedWeightType === 'from_scratch' || this.selectedWeightType === 'pre_trained') {
      if (this.selectedWeightType === 'from_scratch') {
        this.weightTypeTooltip = 'Training the network from scratch';
      } else {
        this.weightTypeTooltip = 'Transfer learning from a pretrained network using online weights';
      }
      this.networksHidden = false;
      this.checkpointsHidden = true;
      this.validateForm.get('checkPoints').clearValidators();
      this.validateForm.get('networks').setValidators([Validators.required]);
    } else if (this.selectedWeightType === 'checkpoint' || this.selectedWeightType === 'pretrained_offline') {
      this.selectedCheckpointValue = '';
      if (this.selectedWeightType === 'checkpoint') {
        this.weightTypeTooltip = 'Training the network using local weights';

        this.checkpointsList = [];
        let index;

        for (let i = 0; i < this.checkpointsValue.length; i++) {
          if (this.checkpointsValue[i].length === this.datasetValue.length) {
            for (let j = 0; j < this.datasetValue.length; j++) {
              if (this.checkpointsValue[i].includes(this.datasetValue[j])) {
                index = 1;
              } else {
                index = 0;
                break;
              }
            }
            if (index === 1) {
              this.checkpointsList.push(this.checkpointsKeys[i].split('/')[1] + ' | ' + this.checkpointsKeys[i].split('/')[0]);
            }
          }
        }
      } else {
        this.checkpointsList = [];

        for (let i = 0; i < this.checkpointsKeys.length; i++) {
          this.checkpointsList.push(this.checkpointsKeys[i].split('/')[1] + ' | ' + this.checkpointsKeys[i].split('/')[0]);
        }

        this.weightTypeTooltip = 'Transfer learning from a pretrained network using local weights';
      }
      this.checkpointsHidden = false;
      this.networksHidden = true;
      this.validateForm.get('networks').clearValidators();
      this.validateForm.get('checkPoints').setValidators([Validators.required]);
    }
  }

  public submitForm(value: { containerName: string; gpus_count: Array<number>; APIPort: number; weightType: string; networks: string;
  checkPoints: string; }): void {
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }

    if (this.checkpointsHidden === true && this.validateForm.value.checkPoints === null){
      this.selectedCheckpointValue = '';
    } else {
      if (this.checkpointsList.length > 0) {
        this.selectedCheckpointValue = this.validateForm.value.checkPoints;
      } else {
        this.selectedCheckpointValue = '';
      }
    }
  }

  isNotSelected(value: number): boolean {
    return this.selectedGPUs.indexOf(value) === -1;
  }

  onNoGPUSelect(value) {
    if (value.includes(-1)) {
      if (value[0] === -1) {
        this.disableSelection = true;
        this.selectedGPUs = [];
        for (let i = value.length - 1; i >= 0; i--) {
          this.isNotSelected(value.splice(0, i));
        }
      } else {
        this.disableSelection = true;
        this.selectedGPUs = [];
        for (let i = value.length - 1; i >= 0; i--) {
          this.isNotSelected(value.splice(0, i));
        }
      }
    } else {
      this.disableSelection = false;
    }
  }

}
