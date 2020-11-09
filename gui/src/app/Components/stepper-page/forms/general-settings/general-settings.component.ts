import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {DataGetterFirstApiService} from '../../../../Services/data-getter-first-api.service';
import {Observable, Observer} from 'rxjs';
import {PrepareDatasetComponent} from '../prepare-dataset/prepare-dataset.component';

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

  validateForm: FormGroup;

  availableGPUs: Array<number> = [];
  selectedGPUs: Array<number> = [];

  disableSelection = false;

  usedPorts: Array<string> = [];
  randomPort = '';

  weightTypes: WeightType[] = [
    {name: 'from scratch' , value: 'from_scratch'},
    {name: 'transfer learning from online weights' , value: 'pre_trained'},
    {name: 'transfer learning from local weights' , value: 'pretrained_offline'},
    {name: 'from checkpoint' , value: 'checkpoint'}
  ];

  selectedWeightType: string;

  networksList: Array<string> = [];

  checkpointsList = [];
  checkpointsKeys = [];
  checkpointsValue = [];

  checkpointsValidKeys = [];
  checkpointsValidValue = [];

  networksHidden = true;
  checkpointsHidden = true;

  downloadableModels: any;
  downloadableModelsKey = [];
  downloadableModelsValue = [];

  runningJobs: Array<string> = [];

  selectedCheckpointValue;
  weightTypeTooltip = 'how to do the training';

  containerNameDisabled = false;
  gpusCountDisabled = false;
  weightTypeDisabled = false;
  networksDisabled = false;
  checkpointsDisabled = false;

  datasetIndex: number;
  datasetValue = [];

  constructor(private fb: FormBuilder, private dataGetterFirstApi: DataGetterFirstApiService) {
    this.validateForm = this.fb.group({
      containerName: ['', [Validators.required], [this.userNameAsyncValidator]],
      gpus_count: [[], [Validators.required]],
      APIPort: [0, [Validators.required]],
      weightType: ['', Validators.required],
      networks: [],
      checkPoints: [],
    });
  }

  ExcludedCharacters(val){
    this.validateForm.get('containerName').setAsyncValidators(this.userNameAsyncValidator);
    if (/[/\\]/.test(val.key)) {
      val.preventDefault();
    }
  }

  userNameAsyncValidator = (control: FormControl) =>
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
          this.validateForm.get('containerName').clearAsyncValidators();
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    })

  onWeightSelection() {
    if (this.selectedWeightType === 'from_scratch' || this.selectedWeightType === 'pre_trained') {
      if (this.selectedWeightType === 'from_scratch') {
        this.weightTypeTooltip = 'training the network from scratch';
      } else {
        this.weightTypeTooltip = 'transfer learning from a pretrained network using online weights';
      }
      this.networksHidden = false;
      this.checkpointsHidden = true;
      if (this.checkpointsHidden === true && this.validateForm.value.checkPoints === null){
        this.validateForm.get('checkPoints').clearValidators();
      }
      this.validateForm.get('networks').setValidators([Validators.required]);
    } else if (this.selectedWeightType === 'checkpoint' || this.selectedWeightType === 'pretrained_offline') {
      if (this.selectedWeightType === 'checkpoint') {
        this.weightTypeTooltip = 'training the network using local weights';

        this.checkpointsList = [];
        let index = 0;

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
          }
          if (index === 1) {
            this.checkpointsList.push(this.checkpointsKeys[i].split('/')[1] + ' | ' + this.checkpointsKeys[i].split('/')[0]);
          }
        }
      } else {
        this.checkpointsList = [];

        for (let i = 0; i < this.checkpointsKeys.length; i++) {
          this.checkpointsList.push(this.checkpointsKeys[i].split('/')[1] + ' | ' + this.checkpointsKeys[i].split('/')[0]);
        }

        this.weightTypeTooltip = 'transfer learning from a pretrained network using local weights';
      }
      console.log('left');
      this.checkpointsHidden = false;
      this.networksHidden = true;
      if (this.networksHidden === true && this.validateForm.value.networks === null){
        this.validateForm.get('networks').clearValidators();
      }
      this.validateForm.get('checkPoints').setValidators([Validators.required]);
    }
  }

  submitForm(value: { containerName: string; gpus_count: Array<number>; APIPort: number; weightType: string; networks: string;
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
        this.selectedCheckpointValue = this.validateForm.value.checkPoints.split(' ')[0].toString();
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

  ngOnInit(): void {
    this.dataGetterFirstApi.getAvailableGPUs().subscribe((availableGPUs) => {
      this.availableGPUs = availableGPUs;
    });

    this.dataGetterFirstApi.getUsedPorts().subscribe((usedPorts) => {
      this.usedPorts = usedPorts;
      this.randomPort = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < usedPorts.length; i++) {
        if (this.randomPort === usedPorts[i]) {
          this.randomPort = (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000).toString();
        } else {
          this.validateForm.controls.APIPort.setValue(Number(this.randomPort));
        }
      }
    });

    this.dataGetterFirstApi.getAvailableNetworks().subscribe((availableNetworks) => {
      this.networksList = availableNetworks;
    });

    this.dataGetterFirstApi.getAvailableCheckPoints().subscribe((availableCheckpoints) => {
      for (const [key, value] of Object.entries(availableCheckpoints)) {
        this.checkpointsKeys.push(key);
        this.checkpointsValue.push(value);
      }
    });

    this.dataGetterFirstApi.getDownloadableModels().subscribe((models) => {
      this.downloadableModels = models;

      for (const [key, value] of Object.entries(this.downloadableModels)) {
        this.downloadableModelsKey.push(key);
        this.downloadableModelsValue.push(value);
      }
    });

    this.dataGetterFirstApi.getAllJobs().subscribe(jobs => {
      this.runningJobs = jobs;
    });
  }

}
