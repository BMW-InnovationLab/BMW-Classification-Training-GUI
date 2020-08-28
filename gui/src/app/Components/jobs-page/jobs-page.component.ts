import {Component, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {DataGetterFirstApiService} from '../../Services/data-getter-first-api.service';
import {DataSenderFirstApiService} from '../../Services/data-sender-first-api.service';
import {RemoveJob} from '../../Interfaces/removeJob';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-jobs-page',
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.css']
})
export class JobsPageComponent implements OnInit, OnDestroy {
  baseURL = environment.url;
  basedEndPoint = environment.baseEndPoint;

  URL = this.baseURL + this.basedEndPoint + '/models/';

  downloadableModels: any;
  downloadableModelsKey = [];
  downloadableModelsValue = [];
  allJobs: Array<string> = [];
  displayList: Array<string> = [];
  finishedJobs: Array<string> = [];
  removeJob: RemoveJob = {
    name: ''
  };

  interval;
  dot;

  isVisibleMiddle = false;

  logs: Array<string> = [];

  exactValue;
  specificJob;

  pageIndex = 1;

  removePopupText = 'Cancel Job?';

  mobile: boolean;

  numberOfJobsPerPage;

  windowHeight: boolean;

  popoverPlacement;

  // tslint:disable-next-line:ban-types
  styleObject(): Object {
    if (this.downloadableModelsKey.length > 5){
      return {'overflow-y': 'scroll'};
    } else {
      return {'overflow-y': 'none'};
    }
  }

  page() {
    if (this.displayList.length > 0) {
      this.displayList = [];
    }

    const from = (this.pageIndex - 1) * Number(5) + 1;
    let to = (from + Number(5)) - 1;


    if (to > this.allJobs.length) {
      to = this.allJobs.length;
      this.numberOfJobsPerPage = (to - from) + 1;
    } else {
      this.numberOfJobsPerPage = 5;
    }

    for (let i = from - 1; i < to; i++) {
      this.displayList.push(this.allJobs[i]);
    }
  }

  jobIsDone = (jobs: string) => {
    if (this.finishedJobs !== undefined) {
      return this.finishedJobs.indexOf(jobs);
    }
    return -1;
  }

  getSpecificJobDownloadableModelValue = (jobs: string) => {
    for (let i = 0; i < this.downloadableModelsKey.length; i++) {
      if (jobs + '.zip' === this.downloadableModelsKey[i]) {
        return this.downloadableModelsValue[i];
      }
    }
  }

  logsButton(jobs: string) {
    this.specificJob = jobs;
    this.removeJob.name = jobs;
    this.dataSenderFirstApi.logs(this.removeJob).subscribe( (logs) => {
      this.logs = logs;
    } );
    this.isVisibleMiddle = true;
  }

  testWithSwagger(){
    window.open(environment.inferenceAPIUrl, '_blank');
  }

  onJobRemove(jobs: string) {
    this.removeJob.name = jobs;
    this.dataSenderFirstApi.removeJob(this.removeJob).subscribe();
    this.dataGetterFirstApi.getAllJobs().subscribe((allJobs) => {
      this.allJobs = allJobs;
      this.displayList = this.allJobs;
      this.numberOfJobsPerPage = this.displayList.length;
    });
  }

  jobRemovePopupText(jobs) {
    if (this.jobIsDone(jobs) !== -1) {
      this.removePopupText = 'Close Job?';
    }
  }

  handleRefreshMiddle(): void {
    console.log(this.specificJob);
    this.removeJob.name = this.specificJob;
    this.dataSenderFirstApi.logs(this.removeJob).subscribe( (logs) => {
      if (logs.length > this.logs.length) {
        this.logs = logs;
      }
    } );
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  onDownloadableModelClick() {
    this.dot = false;
    if (this.mobile === false) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.downloadableModelsKey.length; i++){
        if (this.downloadableModelsKey[i].length > 6) {
          this.popoverPlacement = 'bottomRight';
          break;
        } else {
          this.popoverPlacement = 'bottom';
        }
      }
    }
  }

  constructor(private dataGetterFirstApi: DataGetterFirstApiService, private dataSenderFirstApi: DataSenderFirstApiService) {
    this.interval = setInterval( () => {
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
          if (!extraKey.every(n => this.downloadableModelsKey.includes(missingKey = n))){
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

  ngOnInit(): void {

    if (window.screen.width < 768) { // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }

    if (window.screen.height < 710) {
      this.windowHeight = true;
    } else {
      this.windowHeight = false;
    }

    window.onresize = () => {
      if (window.screen.width < 768) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }

      if (window.screen.height < 710) {
        this.windowHeight = true;
      } else {
        this.windowHeight = false;
      }
    };

    this.dataGetterFirstApi.getAllJobs().subscribe((allJobs) => {
      this.allJobs = allJobs;

      if (this.allJobs.length <= 5){
        this.numberOfJobsPerPage = this.allJobs.length;
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.allJobs.length; i++) {
          this.displayList.push(this.allJobs[i]);
        }
      } else {
        this.numberOfJobsPerPage = 5;
        for (let i = 0; i < 5; i++) {
          this.displayList.push(this.allJobs[i]);
        }
      }

    });

    this.dataGetterFirstApi.getFinishedJobs().subscribe((finishedJobs) => {
      this.finishedJobs = finishedJobs;
    });

    this.dataGetterFirstApi.getDownloadableModels().subscribe((models) => {
      this.downloadableModels = models;

      for (const [key, value] of Object.entries(this.downloadableModels)) {
        this.downloadableModelsKey.push(key);
        this.downloadableModelsValue.push(value);
      }
    });

  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
